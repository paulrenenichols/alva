/**
 * @fileoverview Dashboard navigation component with logout functionality
 */

'use client';

import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

const NAV_CONTAINER_CLASSES = 'bg-bg-elevated shadow-sm border-b';
const NAV_CONTENT_CLASSES = 'px-6 py-4';
const NAV_HEADER_CLASSES = 'flex items-center justify-between';
const BRAND_CONTAINER_CLASSES = 'flex items-center space-x-4';
const BRAND_TITLE_CLASSES = 'text-xl font-bold text-primary-600';
const BRAND_SUBTITLE_CLASSES = 'text-sm text-text-secondary';
const ACTIONS_CONTAINER_CLASSES = 'flex items-center space-x-4';
const LOGOUT_BUTTON_CLASSES = 'text-text-secondary';

/**
 * @description Renders the dashboard navigation bar with brand and logout functionality
 */
export function DashboardNav() {
  const { clearAuth } = useAuthStore();

  /**
   * @description Handles user logout by clearing auth state and redirecting to home
   */
  const handleLogout = (): void => {
    clearAuth();
    window.location.href = '/';
  };

  return (
    <nav className={NAV_CONTAINER_CLASSES}>
      <div className={NAV_CONTENT_CLASSES}>
        <div className={NAV_HEADER_CLASSES}>
          <div className={BRAND_CONTAINER_CLASSES}>
            <h1 className={BRAND_TITLE_CLASSES}>Alva</h1>
            <span className={BRAND_SUBTITLE_CLASSES}>Marketing Assistant</span>
          </div>

          <div className={ACTIONS_CONTAINER_CLASSES}>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={LOGOUT_BUTTON_CLASSES}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
