from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uvicorn
import time

app = FastAPI(title="Namma Space 3D Reconstruction Service")

class ReconstructionRequest(BaseModel):
    job_id: str
    project_id: str
    video_path: str

from extract_frames import extract_frames_from_video
import os

def processing_pipeline(job_id: str, project_id: str, video_path: str):
    """
    Executes the spatial reconstruction pipeline:
    1. OpenCV Frame Extraction
    2. COLMAP feature matching (Simulated)
    3. Open3D mesh generation (Simulated)
    """
    print(f"[PYTHON] Starting processing for project {project_id} (Job: {job_id})")
    print(f"[PYTHON] Input video: {video_path}")
    
    # 1. OpenCV Frame Extraction
    print(f"[PYTHON] Phase 1: Extracting frames...")
    
    # Determine absolute path relative to the backend directory
    # If the video_path is just a filename, we assume it's in the uploads directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    full_video_path = video_path
    
    # Create an output directory for the frames
    output_frames_dir = os.path.join(base_dir, "uploads", "projects", project_id, "frames")
    
    try:
        num_frames = extract_frames_from_video(full_video_path, output_frames_dir, fps=3)
        print(f"[PYTHON] Phase 1 Complete: {num_frames} frames ready for photogrammetry.")
        
        # 2. COLMAP Sparse/Dense Reconstruction
        print(f"[PYTHON] Phase 2: Running COLMAP photogrammetry (Simulated)...")
        time.sleep(4)
        
        # 3. Mesh Generation
        print(f"[PYTHON] Phase 3: Generating 3D Mesh & Optimization (Simulated)...")
        time.sleep(3)
        
        print(f"[PYTHON] Spatial Reconstruction complete for project {project_id}")
        
    except Exception as e:
        print(f"[PYTHON] ERROR in processing pipeline: {str(e)}")

@app.post("/reconstruct")
async def start_reconstruction(req: ReconstructionRequest, background_tasks: BackgroundTasks):
    print(f"[PYTHON] Received reconstruction request for project {req.project_id}")
    
    # We pass the heavy processing to a background task so we don't block the HTTP response
    background_tasks.add_task(processing_pipeline, req.job_id, req.project_id, req.video_path)
    
    return {
        "success": True, 
        "message": "Reconstruction started", 
        "project_id": req.project_id, 
        "job_id": req.job_id
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
