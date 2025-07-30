import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface TextH1Props {
  children: ReactNode;
  className?: string;
}

export function TextH1({ children, className }: TextH1Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
        className
      )}
    >
      {children}
    </h1>
  );
}

interface TextH2Props {
  children: ReactNode;
  className?: string;
}

export function TextH2({ children, className }: TextH2Props) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className
      )}
    >
      {children}
    </h2>
  );
}

interface TextH3Props {
  children: ReactNode;
  className?: string;
}

export function TextH3({ children, className }: TextH3Props) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className
      )}
    >
      {children}
    </h3>
  );
}

interface TextH4Props {
  children: ReactNode;
  className?: string;
}

export function TextH4({ children, className }: TextH4Props) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
    >
      {children}
    </h4>
  );
}

interface TextPProps {
  children: ReactNode;
  className?: string;
}

export function TextP({ children, className }: TextPProps) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>
      {children}
    </p>
  );
}

interface TextSmallProps {
  children: ReactNode;
  className?: string;
}

export function TextSmall({ children, className }: TextSmallProps) {
  return (
    <small className={cn('text-sm leading-none font-medium', className)}>
      {children}
    </small>
  );
}

interface TextMediumProps {
  children: ReactNode;
  className?: string;
}

export function TextMedium({ children, className }: TextMediumProps) {
  return (
    <span className={cn('text-md leading-none font-medium', className)}>
      {children}
    </span>
  );
}

interface TextLargeProps {
  children: ReactNode;
  className?: string;
}

export function TextLarge({ children, className }: TextLargeProps) {
  return (
    <div className={cn('text-lg font-semibold', className)}>{children}</div>
  );
}

interface TextMutedProps {
  children: ReactNode;
  className?: string;
}

export function TextMuted({ children, className }: TextMutedProps) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)}>{children}</p>
  );
}

interface TextLeadProps {
  children: ReactNode;
  className?: string;
}

export function TextLead({ children, className }: TextLeadProps) {
  return (
    <p className={cn('text-muted-foreground text-xl', className)}>{children}</p>
  );
}

interface TextInlineCodeProps {
  children: ReactNode;
  className?: string;
}

export function TextInlineCode({ children, className }: TextInlineCodeProps) {
  return (
    <code
      className={cn(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
    >
      {children}
    </code>
  );
}
