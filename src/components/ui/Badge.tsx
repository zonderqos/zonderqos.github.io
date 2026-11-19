import React from 'react';
import { cn, type BadgeVariant } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-blue-500/15 text-blue-300 border-blue-500/35 dark:bg-blue-500/15 dark:text-blue-300 light:bg-blue-600/10 light:text-blue-800',
  implemented:
    'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 light:bg-emerald-600/15 light:text-emerald-900',
  completed:
    'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 light:bg-emerald-600/15 light:text-emerald-900',
  experimental:
    'bg-amber-500/15 text-amber-300 border-amber-500/35 light:bg-amber-500/20 light:text-amber-900',
  testing:
    'bg-cyan-500/15 text-cyan-300 border-cyan-500/35 light:bg-cyan-600/15 light:text-cyan-900',
  inDevelopment:
    'bg-blue-500/15 text-blue-300 border-blue-500/35 light:bg-blue-600/15 light:text-blue-900',
  inProgress:
    'bg-blue-500/15 text-blue-300 border-blue-500/35 light:bg-blue-600/15 light:text-blue-900',
  planned:
    'bg-purple-500/15 text-purple-300 border-purple-500/35 light:bg-purple-600/15 light:text-purple-900',
  blocked:
    'bg-rose-500/15 text-rose-300 border-rose-500/35 light:bg-rose-600/15 light:text-rose-900',
  outline: 'bg-transparent zq-text-secondary border-slate-500/35',
};

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
