/**
 * @fileoverview Next.js middleware for admin app
 * Redirects /admin to /admin/ for basePath compatibility
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /admin (exact, no trailing slash) to /admin/
  // Next.js basePath: '/admin' serves root at /admin/ (with trailing slash)
  if (pathname === '/admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin$', // Only match exact /admin (no trailing slash)
};

