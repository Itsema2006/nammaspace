import shutil
import subprocess
from pathlib import Path

import open3d as o3d
import trimesh

from extract_frames import extract_frames_from_video


def run(command: list[str]) -> None:
    print(f"[RECONSTRUCTION] {' '.join(command)}", flush=True)
    subprocess.run(command, check=True)


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

    if not video.is_file():
        raise FileNotFoundError(f"Source video not found: {video}")

    project_dir.mkdir(parents=True, exist_ok=True)
    frame_count = extract_frames_from_video(str(video), str(frames_dir), fps=2)
    if frame_count < 2:
        raise RuntimeError("At least two video frames are required for reconstruction")

    run([
        "colmap", "feature_extractor",
        "--database_path", str(database_path),
        "--image_path", str(frames_dir),
        "--ImageReader.single_camera", "1",
        "--SiftExtraction.use_gpu", "0",
    ])
    run([
        "colmap", "exhaustive_matcher",
        "--database_path", str(database_path),
        "--SiftMatching.use_gpu", "0",
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

    run([
        "colmap", "image_undistorter",
        "--image_path", str(frames_dir),
        "--input_path", str(model_dir),
        "--output_path", str(dense_dir),
        "--output_type", "COLMAP",
    ])
    run([
        "colmap", "patch_match_stereo",
        "--workspace_path", str(dense_dir),
        "--workspace_format", "COLMAP",
        "--PatchMatchStereo.geom_consistency", "true",
    ])
    fused_path = dense_dir / "fused.ply"
    run([
        "colmap", "stereo_fusion",
        "--workspace_path", str(dense_dir),
        "--workspace_format", "COLMAP",
        "--input_type", "geometric",
        "--output_path", str(fused_path),
    ])

    point_cloud = o3d.io.read_point_cloud(str(fused_path))
    if point_cloud.is_empty():
        raise RuntimeError("COLMAP produced an empty point cloud")
    point_cloud, _ = point_cloud.remove_statistical_outlier(nb_neighbors=20, std_ratio=2.0)
    point_cloud.estimate_normals()
    mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        point_cloud, depth=8
    )
    density_values = densities.numpy()
    mesh.remove_vertices_by_mask(density_values < density_values.mean() * 0.35)
    mesh.compute_vertex_normals()
    o3d.io.write_triangle_mesh(str(mesh_path), mesh)

    trimesh_mesh = trimesh.load(str(mesh_path), force="mesh")
    trimesh_mesh.export(str(glb_path), file_type="glb")

    return {
        "modelUrl": f"/outputs/projects/{project_id or video.stem}/reconstruction.glb",
        "pointCloudUrl": f"/outputs/projects/{project_id or video.stem}/dense/fused.ply",
        "metadata": {
            "frameCount": frame_count,
            "pointCount": len(point_cloud.points),
            "meshPath": str(mesh_path),
        },
    }
