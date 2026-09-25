const mongoose = require('mongoose');

const reconstructionJobSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued'
  },
  progress: { type: Number, default: 0 },
  currentStage: { type: String, default: 'queued' },
  videoPath: { type: String, required: true },
  outputPath: { type: String },
  error: { type: String },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ReconstructionJob', reconstructionJobSchema);
