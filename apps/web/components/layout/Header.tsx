/**
 * @fileoverview Header component with navigation and user menu
 */

import { Navigation, NavigationLink } from '@/components/ui/Navigation';
import { HeadingCard } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

const HEADER_CONTAINER_CLASSES = 'bg-bg-primary border-b border-border-subtle';
const HEADER_CONTENT_CLASSES = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
const HEADER_LAYOUT_CLASSES = 'flex items-center justify-between h-16';
const LOGO_CONTAINER_CLASSES = 'flex items-center';
const LOGO_CLASSES = 'text-primary';
const USER_MENU_CLASSES = 'flex items-center space-x-4';

/**
 * @description Renders the main header with navigation and user menu
 */
export function Header() {
  /**
   * @description Handles user profile navigation
   */
  const handleProfileClick = (): void => {
    // TODO: Implement profile navigation
    console.log('Navigate to profile');
  };

  /**
   * @description Handles user sign out
   */
  const handleSignOutClick = (): void => {
    // TODO: Implement sign out functionality
    console.log('Sign out user');
  };

  return (
    <header className={HEADER_CONTAINER_CLASSES}>
      <div className={HEADER_CONTENT_CLASSES}>
        <div className={HEADER_LAYOUT_CLASSES}>
          {/* Logo */}
          <div className={LOGO_CONTAINER_CLASSES}>
            <HeadingCard className={LOGO_CLASSES}>Alva</HeadingCard>
          </div>

          {/* Navigation */}
          <Navigation>
            <NavigationLink href="/dashboard">Dashboard</NavigationLink>
            <NavigationLink href="/dashboard/plan">Plan</NavigationLink>
            <NavigationLink href="/dashboard/tasks">Tasks</NavigationLink>
            <NavigationLink href="/dashboard/settings">Settings</NavigationLink>
          </Navigation>

          {/* User Menu */}
          <div className={USER_MENU_CLASSES}>
            <Button variant="ghost" size="sm" onClick={handleProfileClick}>
              Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOutClick}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
