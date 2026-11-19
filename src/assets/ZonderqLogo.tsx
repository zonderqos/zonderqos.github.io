import React from 'react';
import { cn } from '@/lib/utils';

interface ZonderqLogoProps {
  className?: string;
}

export function ZonderqLogo({ className }: ZonderqLogoProps): React.ReactElement {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8 shrink-0', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="zq-logo-grad"
          x1="6"
          y1="6"
          x2="58"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="14"
        fill="#080B14"
        stroke="url(#zq-logo-grad)"
        strokeWidth="4"
      />
      <path
        d="M19 21H45L23 43H45"
        stroke="url(#zq-logo-grad)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="21" r="3" fill="#3B82F6" />
    </svg>
  );
}
