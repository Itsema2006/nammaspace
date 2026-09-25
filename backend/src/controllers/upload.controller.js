const Project = require('../models/Project');

// @desc    Upload video for a project
// @route   POST /api/projects/:id/upload
// @access  Private
const uploadVideo = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    
    // Check if project exists and belongs to user
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to upload to this project');
    }

    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a video file');
    }

    // Update project with video URL/path and new status
    project.videoUrl = req.file.path;
    project.status = 'uploaded';
    project.progress = 10;
    project.currentStage = 'uploading';
    
    await project.save();

    console.log(`[UPLOAD] Video uploaded for project ${projectId} at ${req.file.path}`);

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadVideo
};
