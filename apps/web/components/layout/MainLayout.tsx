/**
 * @fileoverview Main layout component providing consistent page structure with header
 */

import { Header } from './Header';
import { PageLayout } from '@/components/ui/Layout';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <PageLayout>
      <Header />
      <main className="flex-1">{children}</main>
    </PageLayout>
  );
}
