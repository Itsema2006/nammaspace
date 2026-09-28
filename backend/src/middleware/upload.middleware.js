const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectId = req.params.id;
    const dir = path.join(process.env.UPLOAD_DIR || './uploads', projectId, 'source');
    
    // Create directory if it doesn't exist
    fs.mkdirSync(dir, { recursive: true });
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Keep original extension
    const ext = path.extname(file.originalname);
    cb(null, `video${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['video/mp4', 'video/quicktime', 'video/webm'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, MOV, and WebM are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: (process.env.MAX_VIDEO_SIZE_MB || 1000) * 1024 * 1024,
  },
  fileFilter
});

module.exports = upload;
