'use client';

import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

export function DashboardNav() {
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary-600">Alva</h1>
            <span className="text-sm text-gray-500">Marketing Assistant</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
