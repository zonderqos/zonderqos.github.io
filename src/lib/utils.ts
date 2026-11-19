import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { FeatureStatus, RoadmapStatus } from '@/types/site';

export type BadgeVariant =
  | 'default'
  | 'implemented'
  | 'experimental'
  | 'inDevelopment'
  | 'planned'
  | 'completed'
  | 'inProgress'
  | 'testing'
  | 'blocked'
  | 'outline';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function featureStatusToBadgeVariant(status: FeatureStatus): BadgeVariant {
  switch (status) {
    case 'Implemented':
      return 'implemented';
    case 'Experimental':
      return 'experimental';
    case 'In Development':
      return 'inDevelopment';
    case 'Planned':
      return 'planned';
  }
}

export function roadmapStatusToBadgeVariant(status: RoadmapStatus): BadgeVariant {
  switch (status) {
    case 'Completed':
      return 'completed';
    case 'In Progress':
      return 'inProgress';
    case 'Testing':
      return 'testing';
    case 'Planned':
      return 'planned';
    case 'Blocked':
      return 'blocked';
  }
}

export function calculateStageProgress(tasks: ReadonlyArray<{ status: RoadmapStatus }>): {
  completed: number;
  testing: number;
  inProgress: number;
  total: number;
  percentage: number | null;
} {
  const total = tasks.length;
  if (total === 0) {
    return {
      completed: 0,
      testing: 0,
      inProgress: 0,
      total: 0,
      percentage: null,
    };
  }

  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const testing = tasks.filter((task) => task.status === 'Testing').length;
  const inProgress = tasks.filter((task) => task.status === 'In Progress').length;

  return {
    completed,
    testing,
    inProgress,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}
