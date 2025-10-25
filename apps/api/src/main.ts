/**
 * @fileoverview Main entry point for the API server application
 */

import { buildApp } from './app';

const start = async () => {
  const app = await buildApp();
  
  try {
    const port = parseInt(process.env['PORT'] || '3001');
    const host = process.env['HOST'] || '0.0.0.0';
    
    await app.listen({ port, host });
    console.log(`API service running on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
