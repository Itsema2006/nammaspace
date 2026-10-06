const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const env = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const uploadRoutes = require('./routes/upload.routes');
const reconstructionRoutes = require('./routes/reconstruction.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/outputs', express.static(path.resolve(env.outputDir)));
app.use('/uploads', express.static(path.resolve(env.uploadDir)));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', uploadRoutes);
app.use('/api/projects', reconstructionRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

module.exports = app;
