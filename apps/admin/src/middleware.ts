/**
 * @fileoverview Next.js middleware for admin app
 * Handles redirects for basePath configuration
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /admin to /admin/ (Next.js basePath requires trailing slash for root)
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin',
};

