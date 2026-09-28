import os
import time
import shutil
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, Form
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from generate_3d_map import generate_3d_map

app = FastAPI(title="Namma Space 3D Reconstruction Service")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def processing_pipeline(project_id: str, video_path: str):
    print(f"\n[PYTHON] Starting processing for project {project_id}")
    print(f"[PYTHON] Input video: {video_path}")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(base_dir, "uploads", "projects", project_id, "nerf_output")
    
    try:
        print(f"[PYTHON] Running Nerfstudio pipeline...")
        # Actually run the Nerfstudio orchestration script
        generate_3d_map(video_path, output_dir)
        print(f"[PYTHON] Spatial Reconstruction complete for project {project_id}")
        print(f"[PYTHON] 3D Map exported to: {output_dir}/exports")
        
    except Exception as e:
        print(f"[PYTHON] ERROR in processing pipeline: {str(e)}")

@app.post("/reconstruct/upload")
async def upload_and_reconstruct(
    background_tasks: BackgroundTasks,
    project_id: str = Form(...),
    video: UploadFile = File(...)
):
    print(f"[PYTHON] Received video upload for project {project_id}")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.join(base_dir, "uploads", "projects", project_id)
    os.makedirs(project_dir, exist_ok=True)
    
    # Save the uploaded video
    video_path = os.path.join(project_dir, "source_video.mp4")
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)
        
    print(f"[PYTHON] Video saved to {video_path}")
    
    # Start the processing pipeline in the background
    background_tasks.add_task(processing_pipeline, project_id, video_path)
    
    return {
        "success": True, 
        "message": "Video uploaded and 3D reconstruction started", 
        "project_id": project_id
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
