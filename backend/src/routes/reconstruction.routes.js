const express = require('express');
const router = express.Router();
const { startReconstruction, getProjectStatus } = require('../controllers/reconstruction.controller');
const { protect } = require('../middleware/auth.middleware');

// Mounted on /api/projects
router.post('/:id/reconstruct', protect, startReconstruction);
router.get('/:id/status', protect, getProjectStatus);

module.exports = router;
