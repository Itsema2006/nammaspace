const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const getProjectUploadDir = (projectId) => {
  const dir = path.join(env.uploadDir, 'projects', projectId.toString());
  ensureDirectoryExists(dir);
  return dir;
};

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};

const exists = (filePath) => {
  return fs.existsSync(filePath);
};

// Abstracted URL getter - currently returns local path, 
// could be updated to return S3/Cloudinary URLs in the future
const getFileUrl = (filePath) => {
  // Very simplistic local URL resolution
  if (filePath.startsWith('./') || filePath.startsWith('/')) {
    // Return relative path for static serving
    return filePath.replace('./', '/');
  }
  return filePath;
};

module.exports = {
  ensureDirectoryExists,
  getProjectUploadDir,
  deleteFile,
  exists,
  getFileUrl
};
