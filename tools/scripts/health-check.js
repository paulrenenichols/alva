#!/usr/bin/env node
/**
 * @fileoverview Health check script for Docker containers
 * Uses Node.js to check if the health endpoint is responding
 */

const http = require('http');

const port = process.env.PORT || process.argv[2] || '3000';
const path = process.argv[3] || '/health';
const timeout = 5000; // 5 seconds

const url = `http://localhost:${port}${path}`;

const options = {
  hostname: 'localhost',
  port: port,
  path: path,
  method: 'GET',
  timeout: timeout,
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0); // Success
  } else {
    console.error(`Health check failed: HTTP ${res.statusCode}`);
    process.exit(1); // Failure
  }
});

req.on('error', (error) => {
  console.error(`Health check failed: ${error.message}`);
  process.exit(1); // Failure
});

req.on('timeout', () => {
  req.destroy();
  console.error('Health check failed: Timeout');
  process.exit(1); // Failure
});

req.end();

