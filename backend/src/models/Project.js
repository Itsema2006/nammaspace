const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  status: {
    type: String,
    enum: ['created', 'uploaded', 'queued', 'processing', 'completed', 'failed'],
    default: 'created'
  },
  progress: { type: Number, default: 0 },
  currentStage: {
    type: String,
    enum: ['created', 'uploading', 'extracting_frames', 'preprocessing', 'camera_estimation', 'sparse_reconstruction', 'dense_reconstruction', 'mesh_generation', 'optimization', 'uploading_output', 'completed', 'failed'],
    default: 'created'
  },
  outputModelUrl: { type: String },
  outputType: { type: String, default: 'glb' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
