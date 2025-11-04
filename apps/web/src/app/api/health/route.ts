/**
 * @fileoverview Health check API route for Web service (Next.js)
 */

export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'web',
    version: process.env['APP_VERSION'] || '1.0.0',
  });
}

