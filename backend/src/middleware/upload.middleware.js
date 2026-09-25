const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { getProjectUploadDir } = require('../services/storage.service');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!req.params.id) {
      return cb(new Error('Project ID is missing'), false);
    }
    const uploadPath = getProjectUploadDir(req.params.id);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate safe filename: randomHex + original extension
    const randomHex = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomHex}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, MOV, and WebM are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (process.env.MAX_VIDEO_SIZE_MB || 500) * 1024 * 1024 // e.g., 500MB
  }
});

module.exports = upload;
