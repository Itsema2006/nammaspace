require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const env = require('./config/env');

const PORT = env.port;

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});
