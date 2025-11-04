/**
 * @fileoverview Health check API route for Admin service (Next.js)
 */

export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'admin',
    version: process.env['APP_VERSION'] || '1.0.0',
  });
}

