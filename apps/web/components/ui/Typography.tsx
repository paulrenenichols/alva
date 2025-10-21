import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Heading Components
export function HeadingHero({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        'text-3xl font-bold leading-tight tracking-tight text-text-primary',
        className
      )}
    >
      {children}
    </h1>
  );
}

export function HeadingPage({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        'text-xl font-bold leading-snug text-text-primary',
        className
      )}
    >
      {children}
    </h1>
  );
}

export function HeadingSection({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        'text-lg font-semibold leading-snug text-text-primary',
        className
      )}
    >
      {children}
    </h2>
  );
}

export function HeadingCard({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        'text-base font-semibold leading-snug text-text-primary',
        className
      )}
    >
      {children}
    </h3>
  );
}

// Body Text Components
export function BodyDefault({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        'text-base font-normal leading-normal text-text-primary',
        className
      )}
    >
      {children}
    </p>
  );
}

export function BodyLarge({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        'text-md font-normal leading-normal text-text-primary',
        className
      )}
    >
      {children}
    </p>
  );
}

export function BodySmall({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        'text-sm font-normal leading-normal text-text-secondary',
        className
      )}
    >
      {children}
    </p>
  );
}

// Specialized Components
export function Label({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        'text-sm font-medium leading-snug text-text-primary',
        className
      )}
    >
      {children}
    </span>
  );
}

export function Caption({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        'text-xs font-normal leading-snug text-text-secondary',
        className
      )}
    >
      {children}
    </span>
  );
}

export function Metadata({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        'text-xs font-medium leading-snug tracking-wider uppercase text-text-secondary',
        className
      )}
    >
      {children}
    </span>
  );
}

// Link Components
export function Link({
  children,
  className,
  ...props
}: TypographyProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'text-blue hover:text-blue-light transition-colors duration-150',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function LinkGhost({
  children,
  className,
  ...props
}: TypographyProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'text-text-secondary hover:text-text-primary transition-colors duration-150',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
