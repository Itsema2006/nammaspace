import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
import open3d as o3d
import trimesh

from extract_frames import extract_frames_with_metrics


def run(command: list[str]) -> None:
    print(f"[RECONSTRUCTION] {' '.join(command)}", flush=True)
    subprocess.run(command, check=True)


def run_capture(command: list[str]) -> str:
    print(f"[RECONSTRUCTION] {' '.join(command)}", flush=True)
    result = subprocess.run(command, check=True, text=True, capture_output=True)
    return result.stdout + result.stderr


def export_colmap_metrics(model_dir: Path, metrics_dir: Path) -> dict:
    metrics_dir.mkdir(parents=True, exist_ok=True)
    run([
        "colmap", "model_converter",
        "--input_path", str(model_dir),
        "--output_path", str(metrics_dir),
        "--output_type", "TXT",
    ])

    image_lines = [
        line for line in (metrics_dir / "images.txt").read_text().splitlines()
        if line and not line.startswith("#")
    ]
    point_lines = [
        line for line in (metrics_dir / "points3D.txt").read_text().splitlines()
        if line and not line.startswith("#")
    ]
    errors = []
    for line in point_lines:
        fields = line.split()
        if len(fields) > 7:
            errors.append(float(fields[7]))

    registered_cameras = len(image_lines) // 2
    return {
        "registeredCameras": registered_cameras,
        "pointCount": len(point_lines),
        "reprojectionError": sum(errors) / len(errors) if errors else None,
    }


def prepare_nerfstudio_data(frames_dir: Path, model_dir: Path, data_dir: Path) -> None:
    if data_dir.exists():
        shutil.rmtree(data_dir)
    (data_dir / "images").mkdir(parents=True)
    shutil.copytree(frames_dir, data_dir / "images", dirs_exist_ok=True)
    shutil.copytree(model_dir, data_dir / "colmap" / "sparse" / "0")
    run([
        sys.executable, "-m", "nerfstudio.scripts.process_data", "images",
        "--data", str(data_dir / "images"),
        "--output-dir", str(data_dir),
        "--skip-colmap",
        "--colmap-model-path", "colmap/sparse/0",
        "--no-gpu",
    ])


def train_gaussian_splat(data_dir: Path, training_dir: Path, max_iterations: int) -> Path:
    device = "mps" if hasattr(__import__("torch").backends, "mps") and __import__("torch").backends.mps.is_available() else "cpu"
    run([
        sys.executable, "-m", "nerfstudio.scripts.train", "splatfacto",
        "--data", str(data_dir),
        "--output-dir", str(training_dir),
        "--max-num-iterations", str(max_iterations),
        "--machine.device-type", device,
        "nerfstudio-data",
    ])
    configs = list(training_dir.rglob("config.yml"))
    if not configs:
        raise RuntimeError("Gaussian Splatting training finished without a config.yml")
    config_path = max(configs, key=lambda path: path.stat().st_mtime)
    export_dir = training_dir / "export"
    run([
        sys.executable, "-m", "nerfstudio.scripts.exporter", "gaussian-splat",
        "--load-config", str(config_path),
        "--output-dir", str(export_dir),
    ])
    splat_files = list(export_dir.rglob("*.ply")) + list(export_dir.rglob("*.splat"))
    if not splat_files:
        raise RuntimeError("Gaussian Splatting export produced no splat asset")
    return max(splat_files, key=lambda path: path.stat().st_mtime)


def count_gaussians(splat_path: Path) -> int:
    if splat_path.suffix == ".splat":
        return splat_path.stat().st_size // 32
    for line in splat_path.read_text(errors="ignore").splitlines():
        if line.startswith("element vertex "):
            return int(line.split()[-1])
        if line == "end_header":
            break
    return 0


def reconstruct(video_path: str, output_dir: str, project_id: str | None = None) -> dict:
    video = Path(video_path).resolve()
    root = Path(output_dir).resolve()
    project_dir = root / "projects" / (project_id or video.stem)
    frames_dir = project_dir / "frames"
    database_path = project_dir / "database.db"
    sparse_dir = project_dir / "sparse"
    dense_dir = project_dir / "dense"
    mesh_path = project_dir / "reconstruction.ply"
    glb_path = project_dir / "reconstruction.glb"
    data_dir = project_dir / "nerfstudio-data"
    training_dir = project_dir / "splat-training"
    started_at = time.monotonic()

    if not video.is_file():
        raise FileNotFoundError(f"Source video not found: {video}")

    project_dir.mkdir(parents=True, exist_ok=True)
    frame_metrics = extract_frames_with_metrics(str(video), str(frames_dir), fps=2)
    frame_count = frame_metrics["frameCount"]
    if frame_count < 2:
        raise RuntimeError("RECONSTRUCTION QUALITY TOO LOW: fewer than two usable frames after blur/duplicate filtering")
    if frame_metrics["overlapWarning"]:
        raise RuntimeError("RECONSTRUCTION QUALITY TOO LOW: insufficient visual overlap or camera motion")

    run([
        "colmap", "feature_extractor",
        "--database_path", str(database_path),
        "--image_path", str(frames_dir),
        "--ImageReader.single_camera", "1",
    ])
    run([
        "colmap", "exhaustive_matcher",
        "--database_path", str(database_path),
    ])
    sparse_dir.mkdir(exist_ok=True)
    run([
        "colmap", "mapper",
        "--database_path", str(database_path),
        "--image_path", str(frames_dir),
        "--output_path", str(sparse_dir),
    ])

    model_dir = sparse_dir / "0"
    if not model_dir.is_dir():
        raise RuntimeError("COLMAP could not estimate camera poses from the video")

    colmap_metrics = export_colmap_metrics(model_dir, project_dir / "colmap-metrics")
    if colmap_metrics["registeredCameras"] < 3 or colmap_metrics["pointCount"] < 100:
        raise RuntimeError("RECONSTRUCTION QUALITY TOO LOW: insufficient registered cameras or sparse points")

    prepare_nerfstudio_data(frames_dir, model_dir, data_dir)
    max_iterations = int(os.environ.get("SPLAT_MAX_ITERATIONS", "30000"))
    splat_path = train_gaussian_splat(data_dir, training_dir, max_iterations)

    return {
        "modelUrl": f"/reconstruction-assets/projects/{project_id or video.stem}/{splat_path.relative_to(project_dir)}",
        "renderMode": "gaussian-splat-trained",
        "metadata": {
            "frameCount": frame_count,
            "frameMetrics": frame_metrics,
            **colmap_metrics,
            "registeredPercentage": round(colmap_metrics["registeredCameras"] / frame_count * 100, 2),
            "gaussianCount": count_gaussians(splat_path),
            "trainingIterations": max_iterations,
            "processingSeconds": round(time.monotonic() - started_at, 2),
            "outputBytes": splat_path.stat().st_size,
        },
    }
