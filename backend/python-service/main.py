import os
import shutil
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, Form
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from reconstruction_pipeline import reconstruct

app = FastAPI(title="Namma Space 3D Reconstruction Service")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


class ReconstructionRequest(BaseModel):
    job_id: str
    project_id: str
    video_path: str
    output_dir: str

def processing_pipeline(project_id: str, video_path: str):
    print(f"\n[PYTHON] Starting processing for project {project_id}")
    print(f"[PYTHON] Input video: {video_path}")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(base_dir, "uploads", "projects", project_id, "reconstruction")
    
    try:
        print(f"[PYTHON] Running COLMAP/Open3D pipeline...")
        reconstruct(video_path, output_dir, project_id)
        print(f"[PYTHON] Spatial reconstruction complete for project {project_id}")
        
    except Exception as e:
        print(f"[PYTHON] ERROR in processing pipeline: {str(e)}")


@app.post("/reconstruct")
def reconstruct_project(request: ReconstructionRequest):
    print(f"[PYTHON] Reconstructing project {request.project_id}", flush=True)
    asset = reconstruct(request.video_path, request.output_dir, request.project_id)
    return {"success": True, "job_id": request.job_id, "project_id": request.project_id, "asset": asset}

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
