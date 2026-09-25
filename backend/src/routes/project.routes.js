const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, deleteProject } = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .delete(protect, deleteProject);

module.exports = router;
