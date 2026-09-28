const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  locationName: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  videoUrl: { type: String },
  thumbnailUrl: { type: String },
  status: { 
    type: String, 
    enum: ['created', 'uploaded', 'queued', 'processing', 'completed', 'failed'],
    default: 'created'
  },
  progress: { type: Number, default: 0 },
  currentStage: { type: String },
  outputType: { type: String, default: 'glb' },
  modelUrl: { type: String },
  previewUrl: { type: String },
  boundingBox: {
    minX: Number, minY: Number, minZ: Number,
    maxX: Number, maxY: Number, maxZ: Number
  },
  reconstructionMetadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
