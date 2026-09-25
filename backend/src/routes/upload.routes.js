const express = require('express');
const router = express.Router();
const { uploadVideo } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Note: This router is mounted under /api/projects
// So the route is effectively /api/projects/:id/upload
router.post('/:id/upload', protect, upload.single('video'), uploadVideo);

module.exports = router;
