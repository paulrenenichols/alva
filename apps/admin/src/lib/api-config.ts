/**
 * @fileoverview Utility functions for API configuration
 */

/**
 * @description Get the auth service URL from environment variable with fallback to localhost for development
 */
export function getAuthUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable
    return process.env['NEXT_PUBLIC_AUTH_URL'] || 'http://localhost:3002';
  }
  // Server-side: use environment variable
  return process.env['NEXT_PUBLIC_AUTH_URL'] || 'http://localhost:3002';
}

/**
 * @description Get the API service URL from environment variable with fallback to localhost for development
 */
export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable
    return process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';
  }
  // Server-side: use environment variable
  return process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';
}

