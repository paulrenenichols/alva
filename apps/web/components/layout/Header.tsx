import { Navigation, NavigationLink } from '@/components/ui/Navigation';
import { HeadingCard } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="bg-bg-primary border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <HeadingCard className="text-gold">Alva</HeadingCard>
          </div>

          {/* Navigation */}
          <Navigation>
            <NavigationLink href="/dashboard">Dashboard</NavigationLink>
            <NavigationLink href="/dashboard/plan">Plan</NavigationLink>
            <NavigationLink href="/dashboard/tasks">Tasks</NavigationLink>
            <NavigationLink href="/dashboard/settings">Settings</NavigationLink>
          </Navigation>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Profile
            </Button>
            <Button variant="ghost" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
