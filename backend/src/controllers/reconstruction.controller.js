const Project = require('../models/Project');
const ReconstructionJob = require('../models/ReconstructionJob');
const { addReconstructionJob } = require('../services/queue.service');
const { exists } = require('../services/storage.service');

// @desc    Start reconstruction process
// @route   POST /api/projects/:id/reconstruct
// @access  Private
const startReconstruction = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    
    if (project.userId.toString() !== userId.toString()) {
      res.status(401);
      throw new Error('Not authorized for this project');
    }

    if (!project.videoUrl) {
      res.status(400);
      throw new Error('No video found for this project. Please upload a video first.');
    }

    if (!exists(project.videoUrl)) {
      res.status(400);
      throw new Error('Video file is missing from storage.');
    }

    // Check if a job already exists
    const existingJob = await ReconstructionJob.findOne({ projectId, status: { $in: ['queued', 'processing'] } });
    if (existingJob) {
      return res.status(400).json({
        success: false,
        message: 'A reconstruction job is already running for this project.'
      });
    }

    // Create Reconstruction Job
    const job = await ReconstructionJob.create({
      projectId,
      userId,
      videoPath: project.videoUrl,
      status: 'queued',
      currentStage: 'queued'
    });

    // Update Project Status
    project.status = 'queued';
    project.currentStage = 'queued';
    await project.save();

    // Add job to BullMQ
    const bullmqJob = await addReconstructionJob({
      projectId: projectId.toString(),
      jobId: job._id.toString(),
      videoPath: project.videoUrl
    });

    res.json({
      success: true,
      projectId: project._id,
      jobId: job._id,
      status: 'queued'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project status
// @route   GET /api/projects/:id/status
// @access  Private
const getProjectStatus = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this project');
    }

    res.json({
      projectId: project._id,
      status: project.status,
      progress: project.progress,
      stage: project.currentStage,
      modelUrl: project.outputModelUrl || null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startReconstruction,
  getProjectStatus
};
