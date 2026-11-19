import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_CACHE_TTL_MS,
  fetchAllGitHubReleasesPaginated,
  fetchDownloadSnapshotsDataset,
} from '@/lib/githubReleasesClient';
import { computeReleaseDashboardStats } from '@/lib/releaseFormatters';
import { mergeLiveObservationIntoSnapshots } from '@/lib/snapshotAnalytics';
import type {
  DownloadSnapshotEntry,
  NormalizedRelease,
  ReleaseDashboardStats,
} from '@/types/releases';

export interface ReleasesContextValue {
  releases: NormalizedRelease[];
  stats: ReleaseDashboardStats;
  snapshots: DownloadSnapshotEntry[];
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: string | null;
  pagesFetched: number;
  fromCache: boolean;
  isStaleCache: boolean;
  rateLimitRemaining: number | null;
  rateLimitResetAt: string | null;
  errorMessage: string | null;
  refreshReleases: () => Promise<void>;
}

const ReleasesContext = createContext<ReleasesContextValue | null>(null);

export function ReleasesProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [releases, setReleases] = useState<NormalizedRelease[]>([]);
  const [recordedSnapshots, setRecordedSnapshots] = useState<DownloadSnapshotEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [pagesFetched, setPagesFetched] = useState<number>(0);
  const [fromCache, setFromCache] = useState<boolean>(false);
  const [isStaleCache, setIsStaleCache] = useState<boolean>(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);
  const [rateLimitResetAt, setRateLimitResetAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAll = useCallback(async (forceRefresh: boolean) => {
    const [releasesResult, snapshotDataset] = await Promise.all([
      fetchAllGitHubReleasesPaginated({ forceRefresh }),
      fetchDownloadSnapshotsDataset(),
    ]);

    setReleases(releasesResult.releases);
    setLastUpdated(releasesResult.fetchedAt);
    setPagesFetched(releasesResult.pagesFetched);
    setFromCache(releasesResult.fromCache);
    setIsStaleCache(releasesResult.isStaleCache);
    setRateLimitRemaining(releasesResult.rateLimitRemaining);
    setRateLimitResetAt(releasesResult.rateLimitResetAt);
    setErrorMessage(releasesResult.errorMessage);

    if (snapshotDataset && Array.isArray(snapshotDataset.snapshots)) {
      setRecordedSnapshots(snapshotDataset.snapshots);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    let active = true;

    const initialFetch = async () => {
      if (!active) return;
      await loadAll(false);
    };

    void initialFetch();

    // Automatic periodic synchronization after cache TTL
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadAll(true);
      }
    }, DEFAULT_CACHE_TTL_MS);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [loadAll]);

  const refreshReleases = useCallback(async () => {
    setIsRefreshing(true);
    await loadAll(true);
  }, [loadAll]);

  const stats = useMemo(() => computeReleaseDashboardStats(releases), [releases]);

  const snapshots = useMemo(
    () =>
      mergeLiveObservationIntoSnapshots(
        recordedSnapshots,
        releases,
        lastUpdated ?? new Date().toISOString(),
      ),
    [recordedSnapshots, releases, lastUpdated],
  );

  const value = useMemo<ReleasesContextValue>(
    () => ({
      releases,
      stats,
      snapshots,
      isLoading,
      isRefreshing,
      lastUpdated,
      pagesFetched,
      fromCache,
      isStaleCache,
      rateLimitRemaining,
      rateLimitResetAt,
      errorMessage,
      refreshReleases,
    }),
    [
      releases,
      stats,
      snapshots,
      isLoading,
      isRefreshing,
      lastUpdated,
      pagesFetched,
      fromCache,
      isStaleCache,
      rateLimitRemaining,
      rateLimitResetAt,
      errorMessage,
      refreshReleases,
    ],
  );

  return <ReleasesContext.Provider value={value}>{children}</ReleasesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReleases(): ReleasesContextValue {
  const ctx = useContext(ReleasesContext);
  if (!ctx) {
    throw new Error('useReleases must be used within a ReleasesProvider');
  }
  return ctx;
}
