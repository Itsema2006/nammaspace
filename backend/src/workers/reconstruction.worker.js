const { Worker } = require('bullmq');
const env = require('../config/env');
const Project = require('../models/Project');
const ReconstructionJob = require('../models/ReconstructionJob');
const { startPythonReconstruction } = require('../services/python.service');
const connectDB = require('../config/db');

// Connect to DB for the worker process
connectDB();

const connection = {
  url: env.redisUrl
};

const worker = new Worker('reconstruction', async job => {
  const { projectId, jobId, videoPath, outputDir } = job.data;
  console.log(`[WORKER] Processing started for job ${jobId}, project ${projectId}`);

  try {
    // 1. Update status to processing
    await ReconstructionJob.findByIdAndUpdate(jobId, { status: 'processing', startedAt: new Date() });
    await Project.findByIdAndUpdate(projectId, { status: 'processing', currentStage: 'extracting_frames' });

    // 2. Call the Python Service
    console.log(`[WORKER] Calling Python Service for project ${projectId}...`);
    const pythonResponse = await startPythonReconstruction(jobId, projectId, videoPath, outputDir);
    console.log(`[WORKER] Python service accepted job:`, pythonResponse);

    const asset = pythonResponse.asset || {};
    await ReconstructionJob.findByIdAndUpdate(jobId, {
      status: 'completed',
      progress: 100,
      currentStage: 'completed',
      outputPath: asset.modelUrl || asset.pointCloudUrl,
      completedAt: new Date()
    });
    await Project.findByIdAndUpdate(projectId, {
      status: 'completed',
      progress: 100,
      currentStage: 'completed',
      modelUrl: asset.modelUrl || null,
      previewUrl: asset.previewUrl || null,
      reconstructionMetadata: asset.metadata || null
    });

  } catch (error) {
    console.error(`[WORKER] Job ${jobId} failed:`, error.message);
    
    // Update statuses to failed
    await ReconstructionJob.findByIdAndUpdate(jobId, { status: 'failed', error: error.message, completedAt: new Date() });
    await Project.findByIdAndUpdate(projectId, { status: 'failed', currentStage: 'failed' });
    throw error;
  }
}, { connection });

worker.on('completed', job => {
  console.log(`[WORKER] Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`[WORKER] Job ${job.id} has failed with ${err.message}`);
});

console.log('[WORKER] Reconstruction worker is running and listening for jobs...');
