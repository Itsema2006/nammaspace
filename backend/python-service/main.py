import os
import shutil
from pathlib import Path
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, Form
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from reconstruction_pipeline import reconstruct

app = FastAPI(title="Namma Space 3D Reconstruction Service")
UPLOAD_ROOT = Path(__file__).resolve().parent / "uploads"
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)
reconstruction_status: dict[str, dict] = {}

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
app.mount("/reconstruction-assets", StaticFiles(directory=UPLOAD_ROOT), name="reconstruction-assets")


class ReconstructionRequest(BaseModel):
    job_id: str
    project_id: str
    video_path: str
    output_dir: str

def processing_pipeline(project_id: str, video_path: str):
    print(f"\n[PYTHON] Starting processing for project {project_id}")
    print(f"[PYTHON] Input video: {video_path}")
    
    output_dir = str(UPLOAD_ROOT)
    reconstruction_status[project_id] = {"status": "processing"}
    
    try:
        print(f"[PYTHON] Running COLMAP/Open3D pipeline...")
        asset = reconstruct(video_path, output_dir, project_id)
        reconstruction_status[project_id] = {"status": "completed", "asset": asset}
        print(f"[PYTHON] Spatial reconstruction complete for project {project_id}")
        
    except Exception as e:
        reconstruction_status[project_id] = {"status": "failed", "error": str(e)}
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
    
    project_dir = os.path.join(UPLOAD_ROOT, "projects", project_id)
    os.makedirs(project_dir, exist_ok=True)
    
    # Save the uploaded video
    video_path = os.path.join(project_dir, "source_video.mp4")
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)
        
    print(f"[PYTHON] Video saved to {video_path}")
    
    # Start the processing pipeline in the background
    reconstruction_status[project_id] = {"status": "queued"}
    background_tasks.add_task(processing_pipeline, project_id, video_path)
    
    return {
        "success": True, 
        "message": "Video uploaded and 3D reconstruction started", 
        "project_id": project_id
    }


@app.get("/reconstruct/{project_id}/status")
def get_reconstruction_status(project_id: str):
    return {
        "project_id": project_id,
        **reconstruction_status.get(project_id, {"status": "not_found"})
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
