const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { uploadVideo } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/:id/upload', protect, upload.single('video'), uploadVideo);

module.exports = router;
