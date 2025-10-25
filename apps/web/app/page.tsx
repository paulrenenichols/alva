/**
 * @fileoverview Root page component that renders the main landing page
 */

import { LandingPage } from '@/components/landing/LandingPage';

// Force dynamic rendering to avoid prerender issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootPage() {
  return <LandingPage />;
}
