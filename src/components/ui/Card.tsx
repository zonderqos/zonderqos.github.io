import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  children: React.ReactNode;
}

export function Card({
  glass = false,
  className,
  children,
  ...props
}: CardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        glass ? 'zq-glass' : 'zq-surface-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
