/**
 * @fileoverview Reusable card components with variants and sub-components
 */

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'highlighted' | 'interactive';
}

const BASE_CARD_CLASSES = 'bg-bg-elevated rounded-lg';

const CARD_VARIANT_CLASSES = {
  default: 'border border-border-subtle shadow-none',
  elevated: 'border-transparent shadow-md',
  highlighted: 'border-l-4 border-l-primary border-y border-r border-border-subtle shadow-none',
  interactive: 'border border-border-subtle hover:bg-bg-secondary hover:shadow-md transition-all duration-150 cursor-pointer',
};

/**
 * @description Renders a card container with customizable variants
 * @param children - Card content
 * @param className - Additional CSS classes
 * @param variant - Card style variant (default, elevated, highlighted, interactive)
 */
export function Card({ children, className, variant = 'default' }: CardProps) {
  const cardClasses = cn(
    BASE_CARD_CLASSES,
    CARD_VARIANT_CLASSES[variant],
    className
  );

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CARD_HEADER_CLASSES = 'p-6 pb-4';

/**
 * @description Renders a card header section
 * @param children - Header content
 * @param className - Additional CSS classes
 */
export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn(CARD_HEADER_CLASSES, className)}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

const CARD_BODY_CLASSES = 'p-6 py-4';

/**
 * @description Renders a card body section
 * @param children - Body content
 * @param className - Additional CSS classes
 */
export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={cn(CARD_BODY_CLASSES, className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CARD_FOOTER_CLASSES = 'p-6 pt-4';

/**
 * @description Renders a card footer section
 * @param children - Footer content
 * @param className - Additional CSS classes
 */
export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn(CARD_FOOTER_CLASSES, className)}>
      {children}
    </div>
  );
}
