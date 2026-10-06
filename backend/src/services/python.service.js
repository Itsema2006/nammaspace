const axios = require('axios');
const env = require('../config/env');

const startPythonReconstruction = async (jobId, projectId, videoPath, outputDir) => {
  try {
    const response = await axios.post(`${env.pythonServiceUrl}/reconstruct`, {
      job_id: jobId,
      project_id: projectId,
      video_path: videoPath,
      output_dir: outputDir
    });
    
    return response.data;
  } catch (error) {
    console.error(`[PYTHON] Error starting python reconstruction:`, error.message);
    throw new Error('Failed to communicate with Python processing service');
  }
};

module.exports = {
  startPythonReconstruction
};
