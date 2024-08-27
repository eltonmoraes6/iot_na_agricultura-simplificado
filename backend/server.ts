import http from 'http';
import config from './config/custom-environment-variables';

// Import the initialized app from app.ts
import app from './src/app';

const port = config.port;

// Create an HTTP server and pass the Express app
const server = http.createServer(app);

server.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port: ${port}`);
});

// Error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Event listener for server "listening" event
server.on('listening', () => {
  console.log(`Listening on port ${port}`);
});
