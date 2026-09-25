const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const uploadRoutes = require('./routes/upload.routes');
const reconstructionRoutes = require('./routes/reconstruction.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', uploadRoutes);
app.use('/api/projects', reconstructionRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    services: {
      mongodb: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
      redis: 'pending', // To be implemented in Phase 6
      python: 'pending' // To be implemented in Phase 3
    }
  });
});

app.use(errorHandler);

module.exports = app;
