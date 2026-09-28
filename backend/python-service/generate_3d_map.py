import os
import subprocess
import argparse
from pathlib import Path

def run_command(command: str):
    print(f"\n[Running]: {command}\n")
    # We use shell=True here for simplicity and realtime output streaming
    process = subprocess.Popen(command, shell=True)
    process.wait()
    if process.returncode != 0:
        raise RuntimeError(f"Command failed with exit code {process.returncode}")

def generate_3d_map(video_path: str, output_base_dir: str):
    video_path = Path(video_path).resolve()
    output_base = Path(output_base_dir).resolve()
    scene_name = video_path.stem
    
    # Paths
    processed_data_dir = output_base / "data" / scene_name
    training_outputs_dir = output_base / "outputs" / scene_name
    export_dir = output_base / "exports" / scene_name
    
    # 1. Process Video (extract frames + COLMAP camera poses)
    print("=== STEP 1: Processing Video Data ===")
    if not processed_data_dir.exists():
        process_cmd = f"ns-process-data video --data '{video_path}' --output-dir '{processed_data_dir}'"
        run_command(process_cmd)
    else:
        print(f"Data already processed at {processed_data_dir}. Skipping Step 1.")

    # 2. Train Gaussian Splatting Model
    print("\n=== STEP 2: Training 3D Model (Gaussian Splatting) ===")
    # Note: --timestamp is used to predictably find the output config later
    train_cmd = f"ns-train splatfacto --data '{processed_data_dir}' --output-dir '{output_base / 'outputs'}' --timestamp 'latest'"
    print("This step can take a while and will open a web viewer at http://localhost:7007")
    try:
        # User will manually stop training when they are satisfied (Ctrl+C), or let it run to completion.
        run_command(train_cmd)
    except KeyboardInterrupt:
        print("\nTraining stopped by user. Proceeding to export...")
    except RuntimeError as e:
        # NeRF training sometimes exits after reaching max iterations, which is fine
        print("Training finished or exited.")

    # 3. Export to WebGL friendly format (Splat)
    print("\n=== STEP 3: Exporting Model ===")
    # Find the generated config.yml
    config_path = output_base / "outputs" / scene_name / "splatfacto" / "latest" / "config.yml"
    
    if config_path.exists():
        export_dir.mkdir(parents=True, exist_ok=True)
        export_cmd = f"ns-export gaussian-splat --load-config '{config_path}' --output-dir '{export_dir}'"
        run_command(export_cmd)
        print(f"\n✅ 3D Map Generated Successfully! Exported to: {export_dir}")
        print("You can load the resulting .ply or .splat file into a WebGL viewer.")
    else:
        print(f"\n❌ Error: Could not find training config at {config_path}")
        print("Did the training complete successfully?")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a 3D Map from a video using Nerfstudio")
    parser.add_argument("--video", type=str, required=True, help="Path to the input video file (.mp4, .mov)")
    parser.add_argument("--output", type=str, default="./nerf_workspace", help="Base directory to store outputs")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.video):
        print(f"Error: Video file not found: {args.video}")
    else:
        generate_3d_map(args.video, args.output)
