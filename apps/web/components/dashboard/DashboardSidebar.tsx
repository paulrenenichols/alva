/**
 * @fileoverview Dashboard sidebar navigation component
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Marketing Plan', href: '/dashboard/plan', icon: '📋' },
  { name: 'Daily Quick Wins', href: '/dashboard/quick-wins', icon: '⚡' },
  { name: 'To Do', href: '/dashboard/tasks', icon: '✅' },
  { name: 'Chat', href: '/dashboard/chat', icon: '💬' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

const SIDEBAR_CONTAINER_CLASSES = 'w-64 bg-bg-elevated shadow-sm border-r min-h-screen';
const SIDEBAR_CONTENT_CLASSES = 'p-6';
const NAVIGATION_CONTAINER_CLASSES = 'space-y-2';
const NAVIGATION_LINK_BASE_CLASSES = 'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors';
const NAVIGATION_LINK_ACTIVE_CLASSES = 'bg-primary-muted text-primary';
const NAVIGATION_LINK_INACTIVE_CLASSES = 'text-text-secondary hover:bg-bg-secondary';
const NAVIGATION_ICON_CLASSES = 'text-lg';

/**
 * @description Renders the dashboard sidebar with navigation links
 */
export function DashboardSidebar() {
  const pathname = usePathname();

  /**
   * @description Determines if a navigation item is currently active
   * @param href - Navigation item href
   * @returns True if the item is active
   */
  const isActiveItem = (href: string): boolean => {
    return pathname === href;
  };

  /**
   * @description Gets the CSS classes for a navigation link based on its active state
   * @param href - Navigation item href
   * @returns Combined CSS classes for the navigation link
   */
  const getNavigationLinkClasses = (href: string): string => {
    const isActive = isActiveItem(href);
    return cn(
      NAVIGATION_LINK_BASE_CLASSES,
      isActive ? NAVIGATION_LINK_ACTIVE_CLASSES : NAVIGATION_LINK_INACTIVE_CLASSES
    );
  };

  return (
    <div className={SIDEBAR_CONTAINER_CLASSES}>
      <div className={SIDEBAR_CONTENT_CLASSES}>
        <nav className={NAVIGATION_CONTAINER_CLASSES}>
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={getNavigationLinkClasses(item.href)}
            >
              <span className={NAVIGATION_ICON_CLASSES}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
