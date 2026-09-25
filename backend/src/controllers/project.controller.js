const Project = require('../models/Project');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      res.status(400);
      throw new Error('Project name is required');
    }

    const project = await Project.create({
      userId: req.user._id,
      name,
      description
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this project');
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this project');
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject
};
