const Project = require('../models/Project');
const path = require('path');

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a video file' });
    }

    const projectId = req.params.id;
    
    // Verify project ownership
    const project = await Project.findOne({ _id: projectId, userId: req.user._id });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    // Update project with video URL/path and status
    const videoUrl = path.join(req.file.destination, req.file.filename);
    project.videoUrl = videoUrl;
    project.status = 'uploaded';
    
    await project.save();

    res.json({
      message: 'Video uploaded successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
