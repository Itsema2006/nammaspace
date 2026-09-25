const { Queue } = require('bullmq');
const env = require('../config/env');

const connection = {
  url: env.redisUrl
};

const reconstructionQueue = new Queue('reconstruction', { connection });

// Handle Redis connection errors gracefully so it doesn't crash the server loop
reconstructionQueue.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.error('[QUEUE] Redis connection refused. Make sure Redis is running on port 6379.');
  } else {
    console.error('[QUEUE] Error:', err.message);
  }
});

const addReconstructionJob = async (jobData) => {
  console.log(`[QUEUE] Reconstruction job queued for project ${jobData.projectId}`);
  return await reconstructionQueue.add('process-video', jobData);
};

module.exports = {
  reconstructionQueue,
  addReconstructionJob
};
