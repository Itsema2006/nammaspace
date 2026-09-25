const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

// Connect to MongoDB
connectDB();

const server = http.createServer(app);

server.listen(env.port, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${env.port}`);
});
