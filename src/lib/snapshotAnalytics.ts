import type { DownloadSnapshotEntry, NormalizedRelease } from '@/types/releases';

export interface SnapshotGrowthPoint {
  dateLabel: string;
  timestamp: string;
  cumulativeIsoDownloads: number;
  cumulativeAssetDownloads: number;
  deltaIsoDownloads: number;
  deltaAssetDownloads: number;
}

export interface ReleaseComparisonPoint {
  tagName: string;
  releaseName: string;
  channel: string;
  isoDownloads: number;
  totalDownloads: number;
  deltaFromPreviousRelease: number | null;
}

export function mergeLiveObservationIntoSnapshots(
  recordedSnapshots: ReadonlyArray<DownloadSnapshotEntry>,
  liveReleases: ReadonlyArray<NormalizedRelease>,
  liveTimestamp: string,
): DownloadSnapshotEntry[] {
  const sorted = [...recordedSnapshots].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  if (liveReleases.length === 0) {
    return sorted;
  }

  const totalIsoDownloads = liveReleases.reduce((sum, r) => sum + r.totalIsoDownloads, 0);
  const totalAssetDownloads = liveReleases.reduce((sum, r) => sum + r.totalAssetDownloads, 0);
  const perRelease: Record<string, number> = {};
  for (const r of liveReleases) {
    perRelease[r.tagName] = r.totalIsoDownloads;
  }

  const last = sorted[sorted.length - 1];
  const liveDay = liveTimestamp.slice(0, 10);
  const lastDay = last ? last.timestamp.slice(0, 10) : null;

  if (!last) {
    return [
      {
        timestamp: liveTimestamp,
        totalIsoDownloads,
        totalAssetDownloads,
        perRelease,
      },
    ];
  }

  // If the last snapshot is from the same UTC calendar day, update its live cumulative peak
  // unless the count changed at a newer timestamp
  if (lastDay === liveDay && last.totalIsoDownloads === totalIsoDownloads) {
    return sorted;
  }

  return [
    ...sorted,
    {
      timestamp: liveTimestamp,
      totalIsoDownloads,
      totalAssetDownloads,
      perRelease,
    },
  ];
}

export function computeDailyGrowthFromSnapshots(
  snapshots: ReadonlyArray<DownloadSnapshotEntry>,
): SnapshotGrowthPoint[] {
  if (snapshots.length < 2) {
    return [];
  }

  const sorted = [...snapshots].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  // Collapse multiple observations on the same UTC date to the latest snapshot of that day
  const byDay = new Map<string, DownloadSnapshotEntry>();
  for (const s of sorted) {
    const dayKey = s.timestamp.slice(0, 10);
    byDay.set(dayKey, s);
  }

  const dailySnapshots = Array.from(byDay.values());
  if (dailySnapshots.length < 2) {
    return [];
  }

  const growthPoints: SnapshotGrowthPoint[] = [];
  for (let i = 1; i < dailySnapshots.length; i++) {
    const current = dailySnapshots[i];
    const prev = dailySnapshots[i - 1];
    const deltaIsoDownloads = Math.max(0, current.totalIsoDownloads - prev.totalIsoDownloads);
    const deltaAssetDownloads = Math.max(0, current.totalAssetDownloads - prev.totalAssetDownloads);
    const dateLabel = new Date(current.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    growthPoints.push({
      dateLabel,
      timestamp: current.timestamp,
      cumulativeIsoDownloads: current.totalIsoDownloads,
      cumulativeAssetDownloads: current.totalAssetDownloads,
      deltaIsoDownloads,
      deltaAssetDownloads,
    });
  }

  return growthPoints;
}

function getIsoWeekKey(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return isoTimestamp.slice(0, 10);
  }
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function computeWeeklyGrowthFromSnapshots(
  snapshots: ReadonlyArray<DownloadSnapshotEntry>,
): SnapshotGrowthPoint[] {
  if (snapshots.length < 2) {
    return [];
  }

  const sorted = [...snapshots].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const byWeek = new Map<string, DownloadSnapshotEntry>();
  for (const s of sorted) {
    byWeek.set(getIsoWeekKey(s.timestamp), s);
  }

  const weeklyEntries = Array.from(byWeek.entries());
  if (weeklyEntries.length < 2) {
    return [];
  }

  const points: SnapshotGrowthPoint[] = [];
  for (let i = 1; i < weeklyEntries.length; i++) {
    const [weekKey, current] = weeklyEntries[i];
    const [, prev] = weeklyEntries[i - 1];
    points.push({
      dateLabel: weekKey,
      timestamp: current.timestamp,
      cumulativeIsoDownloads: current.totalIsoDownloads,
      cumulativeAssetDownloads: current.totalAssetDownloads,
      deltaIsoDownloads: Math.max(0, current.totalIsoDownloads - prev.totalIsoDownloads),
      deltaAssetDownloads: Math.max(0, current.totalAssetDownloads - prev.totalAssetDownloads),
    });
  }

  return points;
}

export function computeReleaseToReleaseComparisons(
  releases: ReadonlyArray<NormalizedRelease>,
): ReleaseComparisonPoint[] {
  if (releases.length === 0) {
    return [];
  }

  // Chronological order (oldest -> newest) for release-to-release progression
  const chronological = [...releases].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));

  return chronological.map((release, index) => {
    const prev = index > 0 ? chronological[index - 1] : null;
    const deltaFromPreviousRelease = prev
      ? release.totalIsoDownloads - prev.totalIsoDownloads
      : null;

    return {
      tagName: release.tagName,
      releaseName: release.name,
      channel: release.channel,
      isoDownloads: release.totalIsoDownloads,
      totalDownloads: release.totalAssetDownloads,
      deltaFromPreviousRelease,
    };
  });
}
