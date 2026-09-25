const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/video-to-3d',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  pythonServiceUrl: process.env.PYTHON_SERVICE_URL || 'http://localhost:8000',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  processingDir: process.env.PROCESSING_DIR || './processing',
  outputDir: process.env.OUTPUT_DIR || './outputs',
  frameInterval: process.env.FRAME_INTERVAL || 5,
  maxVideoSizeMb: process.env.MAX_VIDEO_SIZE_MB || 500,
  colmapPath: process.env.COLMAP_PATH || 'colmap'
};
