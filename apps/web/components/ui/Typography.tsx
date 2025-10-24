/**
 * @fileoverview Typography components for consistent text styling across the application
 */

import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Heading Components
const HEADING_HERO_CLASSES =
  'text-3xl font-bold leading-tight tracking-tight text-text-primary';
const HEADING_PAGE_CLASSES = 'text-xl font-bold leading-snug text-text-primary';
const HEADING_SECTION_CLASSES =
  'text-lg font-semibold leading-snug text-text-primary';
const HEADING_CARD_CLASSES =
  'text-base font-semibold leading-snug text-text-primary';

/**
 * @description Renders a hero-level heading (h1)
 * @param children - Heading content
 * @param className - Additional CSS classes
 */
export function HeadingHero({ children, className }: TypographyProps) {
  return <h1 className={cn(HEADING_HERO_CLASSES, className)}>{children}</h1>;
}

/**
 * @description Renders a page-level heading (h1)
 * @param children - Heading content
 * @param className - Additional CSS classes
 */
export function HeadingPage({ children, className }: TypographyProps) {
  return <h1 className={cn(HEADING_PAGE_CLASSES, className)}>{children}</h1>;
}

/**
 * @description Renders a section-level heading (h2)
 * @param children - Heading content
 * @param className - Additional CSS classes
 */
export function HeadingSection({ children, className }: TypographyProps) {
  return <h2 className={cn(HEADING_SECTION_CLASSES, className)}>{children}</h2>;
}

/**
 * @description Renders a card-level heading (h3)
 * @param children - Heading content
 * @param className - Additional CSS classes
 */
export function HeadingCard({ children, className }: TypographyProps) {
  return <h3 className={cn(HEADING_CARD_CLASSES, className)}>{children}</h3>;
}

// Body Text Components
const BODY_DEFAULT_CLASSES =
  'text-base font-normal leading-normal text-text-primary';
const BODY_LARGE_CLASSES =
  'text-md font-normal leading-normal text-text-primary';
const BODY_SMALL_CLASSES =
  'text-sm font-normal leading-normal text-text-secondary';

/**
 * @description Renders default body text (p)
 * @param children - Text content
 * @param className - Additional CSS classes
 */
export function BodyDefault({ children, className }: TypographyProps) {
  return <p className={cn(BODY_DEFAULT_CLASSES, className)}>{children}</p>;
}

/**
 * @description Renders large body text (p)
 * @param children - Text content
 * @param className - Additional CSS classes
 */
export function BodyLarge({ children, className }: TypographyProps) {
  return <p className={cn(BODY_LARGE_CLASSES, className)}>{children}</p>;
}

/**
 * @description Renders small body text (p)
 * @param children - Text content
 * @param className - Additional CSS classes
 */
export function BodySmall({ children, className }: TypographyProps) {
  return <p className={cn(BODY_SMALL_CLASSES, className)}>{children}</p>;
}

// Specialized Components
const LABEL_CLASSES = 'text-sm font-medium leading-snug text-text-primary';
const CAPTION_CLASSES = 'text-xs font-normal leading-snug text-text-secondary';
const METADATA_CLASSES =
  'text-xs font-medium leading-snug tracking-wider uppercase text-text-secondary';

/**
 * @description Renders a label element (span)
 * @param children - Label content
 * @param className - Additional CSS classes
 */
export function Label({ children, className }: TypographyProps) {
  return <span className={cn(LABEL_CLASSES, className)}>{children}</span>;
}

/**
 * @description Renders a caption element (span)
 * @param children - Caption content
 * @param className - Additional CSS classes
 */
export function Caption({ children, className }: TypographyProps) {
  return <span className={cn(CAPTION_CLASSES, className)}>{children}</span>;
}

/**
 * @description Renders metadata text (span)
 * @param children - Metadata content
 * @param className - Additional CSS classes
 */
export function Metadata({ children, className }: TypographyProps) {
  return <span className={cn(METADATA_CLASSES, className)}>{children}</span>;
}

// Link Components
const LINK_CLASSES =
  'text-secondary hover:text-secondary-hover transition-colors duration-150';
const LINK_GHOST_CLASSES =
  'text-text-secondary hover:text-text-primary transition-colors duration-150';

/**
 * @description Renders a styled link element (a)
 * @param children - Link content
 * @param className - Additional CSS classes
 * @param props - Additional anchor HTML attributes
 */
export function Link({
  children,
  className,
  ...props
}: TypographyProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(LINK_CLASSES, className)} {...props}>
      {children}
    </a>
  );
}

/**
 * @description Renders a ghost-style link element (a)
 * @param children - Link content
 * @param className - Additional CSS classes
 * @param props - Additional anchor HTML attributes
 */
export function LinkGhost({
  children,
  className,
  ...props
}: TypographyProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(LINK_GHOST_CLASSES, className)} {...props}>
      {children}
    </a>
  );
}
