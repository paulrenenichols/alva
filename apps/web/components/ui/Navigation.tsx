import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  children: React.ReactNode;
  className?: string;
}

export function Navigation({ children, className }: NavigationProps) {
  return (
    <nav className={cn('flex items-center space-x-8', className)}>
      {children}
    </nav>
  );
}

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
}

export function NavigationLink({
  href,
  children,
  className,
  exact = false,
}: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors duration-150',
        isActive
          ? 'text-gold border-b-2 border-gold pb-1'
          : 'text-text-primary hover:text-gold',
        className
      )}
    >
      {children}
    </Link>
  );
}

interface BreadcrumbsProps {
  children: React.ReactNode;
  className?: string;
}

export function Breadcrumbs({ children, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn('flex items-center space-x-2 text-sm', className)}
      aria-label="Breadcrumb"
    >
      {children}
    </nav>
  );
}

interface BreadcrumbProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  current?: boolean;
}

export function Breadcrumb({
  href,
  children,
  className,
  current = false,
}: BreadcrumbProps) {
  if (current || !href) {
    return (
      <span className={cn('text-text-primary font-medium', className)}>
        {children}
      </span>
    );
  }

  return (
    <>
      <Link
        href={href}
        className={cn(
          'text-text-secondary hover:text-blue transition-colors duration-150',
          className
        )}
      >
        {children}
      </Link>
      <span className="text-text-tertiary">/</span>
    </>
  );
}
