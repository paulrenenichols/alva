/**
 * @fileoverview Navigation components including navigation links and breadcrumbs
 */

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  children: React.ReactNode;
  className?: string;
}

const NAVIGATION_CONTAINER_CLASSES = 'flex items-center space-x-8';

/**
 * @description Renders a navigation container
 * @param children - Navigation links
 * @param className - Additional CSS classes
 */
export function Navigation({ children, className }: NavigationProps) {
  return (
    <nav className={cn(NAVIGATION_CONTAINER_CLASSES, className)}>
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

const NAVIGATION_LINK_BASE_CLASSES = 'text-sm font-medium transition-colors duration-150';
const NAVIGATION_LINK_ACTIVE_CLASSES = 'text-gold border-b-2 border-gold pb-1';
const NAVIGATION_LINK_INACTIVE_CLASSES = 'text-text-primary hover:text-gold';

/**
 * @description Renders a navigation link with active state detection
 * @param href - Link destination
 * @param children - Link content
 * @param className - Additional CSS classes
 * @param exact - Whether to match exact path or allow sub-paths
 */
export function NavigationLink({
  href,
  children,
  className,
  exact = false,
}: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  const linkClasses = cn(
    NAVIGATION_LINK_BASE_CLASSES,
    isActive ? NAVIGATION_LINK_ACTIVE_CLASSES : NAVIGATION_LINK_INACTIVE_CLASSES,
    className
  );

  return (
    <Link href={href} className={linkClasses}>
      {children}
    </Link>
  );
}

interface BreadcrumbsProps {
  children: React.ReactNode;
  className?: string;
}

const BREADCRUMBS_CONTAINER_CLASSES = 'flex items-center space-x-2 text-sm';

/**
 * @description Renders a breadcrumbs navigation container
 * @param children - Breadcrumb items
 * @param className - Additional CSS classes
 */
export function Breadcrumbs({ children, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn(BREADCRUMBS_CONTAINER_CLASSES, className)}
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

const BREADCRUMB_CURRENT_CLASSES = 'text-text-primary font-medium';
const BREADCRUMB_LINK_CLASSES = 'text-text-secondary hover:text-blue transition-colors duration-150';
const BREADCRUMB_SEPARATOR_CLASSES = 'text-text-tertiary';

/**
 * @description Renders a breadcrumb item
 * @param href - Optional link destination
 * @param children - Breadcrumb content
 * @param className - Additional CSS classes
 * @param current - Whether this is the current page
 */
export function Breadcrumb({
  href,
  children,
  className,
  current = false,
}: BreadcrumbProps) {
  const isCurrentPage = current || !href;

  if (isCurrentPage) {
    return (
      <span className={cn(BREADCRUMB_CURRENT_CLASSES, className)}>
        {children}
      </span>
    );
  }

  return (
    <>
      <Link
        href={href}
        className={cn(BREADCRUMB_LINK_CLASSES, className)}
      >
        {children}
      </Link>
      <span className={BREADCRUMB_SEPARATOR_CLASSES}>/</span>
    </>
  );
}
