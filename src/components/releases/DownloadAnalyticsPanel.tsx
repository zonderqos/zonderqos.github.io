import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  GitCompare,
  Info,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  computeDailyGrowthFromSnapshots,
  computeReleaseToReleaseComparisons,
  computeWeeklyGrowthFromSnapshots,
} from '@/lib/snapshotAnalytics';
import { cn } from '@/lib/utils';
import type { DownloadSnapshotEntry, NormalizedRelease } from '@/types/releases';

interface DownloadAnalyticsPanelProps {
  releases: ReadonlyArray<NormalizedRelease>;
  snapshots: ReadonlyArray<DownloadSnapshotEntry>;
}

type AnalyticsTab =
  'by-release' | 'cumulative-time' | 'daily-growth' | 'weekly-growth' | 'release-comparison';

export function DownloadAnalyticsPanel({
  releases,
  snapshots,
}: DownloadAnalyticsPanelProps): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('by-release');

  const dailyGrowth = useMemo(() => computeDailyGrowthFromSnapshots(snapshots), [snapshots]);
  const weeklyGrowth = useMemo(() => computeWeeklyGrowthFromSnapshots(snapshots), [snapshots]);
  const releaseComparisons = useMemo(
    () => computeReleaseToReleaseComparisons(releases),
    [releases],
  );

  const tabs: Array<{
    id: AnalyticsTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'by-release', label: 'Downloads by Release', icon: BarChart3 },
    { id: 'cumulative-time', label: 'Cumulative Over Time', icon: TrendingUp },
    { id: 'daily-growth', label: 'Downloads per Day', icon: Calendar },
    { id: 'weekly-growth', label: 'Downloads per Week', icon: Clock },
    { id: 'release-comparison', label: 'Release-to-Release', icon: GitCompare },
  ];

  const maxReleaseDownloads = Math.max(
    1,
    ...releases.map((r) => Math.max(r.totalIsoDownloads, r.totalAssetDownloads)),
  );

  const maxSnapshotCumulative = Math.max(
    1,
    ...snapshots.map((s) => Math.max(s.totalIsoDownloads, s.totalAssetDownloads)),
  );

  return (
    <Card className="overflow-hidden p-0">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-500/20 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/15 text-[#3B82F6]">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="zq-text-primary text-lg font-extrabold">
                Historical Download Analytics & Release Telemetry
              </h3>
              <Badge variant="default" className="font-mono text-[11px]">
                {snapshots.length} Recorded Observation{snapshots.length === 1 ? '' : 's'}
              </Badge>
            </div>
            <p className="zq-text-secondary mt-0.5 text-xs">
              Real-time GitHub Releases API distribution paired with versioned periodic snapshot
              observations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls="download-analytics-body"
          className="zq-surface-elevated zq-text-secondary hover:zq-text-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition hover:border-blue-500/50 cursor-pointer"
        >
          <span>{isExpanded ? 'Collapse Analytics' : 'Expand Analytics'}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="download-analytics-body"
            initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 p-5 sm:p-6">
              {/* Transparent Snapshot Methodology Banner */}
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                  <div className="zq-text-secondary">
                    <strong className="zq-text-primary">
                      How Historical Download Analytics Work:
                    </strong>{' '}
                    The public GitHub Releases REST API provides real-time cumulative{' '}
                    <code className="font-mono text-blue-300">download_count</code> totals per asset
                    rather than historical daily event logs. To track daily and weekly growth
                    truthfully without fabricating earlier history, an automated GitHub Actions
                    workflow (
                    <code className="font-mono text-blue-300">snapshot-downloads.yml</code>) records
                    periodic timestamped snapshots into{' '}
                    <code className="font-mono text-blue-300">
                      public/data/download-snapshots.json
                    </code>
                    .
                  </div>
                </div>
              </div>

              {/* Analytics Navigation Tabs */}
              <div
                role="tablist"
                aria-label="Download analytics chart views"
                className="flex flex-wrap gap-2"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer',
                        isSelected
                          ? 'border-[#3B82F6] bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 zq-text-primary'
                          : 'zq-surface-elevated zq-text-secondary hover:border-blue-500/40',
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 text-[#3B82F6]" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* View 1: Downloads by Release (Live API Bar Chart) */}
              {activeTab === 'by-release' && (
                <div className="zq-surface-elevated rounded-2xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="zq-text-primary text-sm font-bold">
                      Cumulative Downloads by Release (Live GitHub Releases API)
                    </h4>
                    <span className="zq-text-muted font-mono text-xs">
                      Source: api.github.com/repos/dwierzbicki11/ZOnderqOS/releases
                    </span>
                  </div>

                  {releases.length === 0 ? (
                    <p className="zq-text-muted py-8 text-center font-mono text-xs">
                      No published releases returned by the GitHub API.
                    </p>
                  ) : (
                    <div className="mt-6 space-y-5">
                      {releases.map((rel) => {
                        const isoBarPct = Math.max(
                          8,
                          Math.round((rel.totalIsoDownloads / maxReleaseDownloads) * 100),
                        );
                        return (
                          <div key={rel.id} className="space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="zq-text-primary font-bold">{rel.name}</span>
                                <span className="font-mono text-[#3B82F6]">({rel.tagName})</span>
                                <Badge variant="completed" className="font-mono text-[10px]">
                                  {rel.channel}
                                </Badge>
                              </div>
                              <div className="font-mono text-xs">
                                <span className="font-bold text-emerald-400">
                                  {rel.totalIsoDownloads.toLocaleString('en-US')} ISO
                                </span>{' '}
                                <span className="zq-text-muted">
                                  / {rel.totalAssetDownloads.toLocaleString('en-US')} total asset
                                  downloads
                                </span>
                              </div>
                            </div>

                            {/* SVG Horizontal Bar Chart */}
                            <div className="h-7 w-full overflow-hidden rounded-xl bg-slate-900/90 p-1">
                              <div
                                className="flex h-full items-center rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-2.5 font-mono text-[11px] font-bold text-white transition-all duration-500"
                                style={{ width: `${isoBarPct}%` }}
                              >
                                {rel.totalIsoDownloads.toLocaleString('en-US')}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* View 2: Cumulative Downloads Over Time (Recorded Snapshots) */}
              {activeTab === 'cumulative-time' && (
                <div className="zq-surface-elevated rounded-2xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="zq-text-primary text-sm font-bold">
                      Cumulative ISO Downloads Over Time (Recorded Observations)
                    </h4>
                    <span className="zq-text-muted font-mono text-xs">
                      {snapshots.length} timestamped snapshot{snapshots.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {snapshots.map((snap, idx) => {
                      const heightPct = Math.max(
                        15,
                        Math.round((snap.totalIsoDownloads / maxSnapshotCumulative) * 100),
                      );
                      return (
                        <div
                          key={`${snap.timestamp}-${idx}`}
                          className="rounded-xl border border-slate-700/60 bg-slate-900/70 p-4"
                        >
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="text-blue-300">Observation #{idx + 1}</span>
                            <span className="text-slate-400">
                              {new Date(snap.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="mt-2 font-mono text-2xl font-extrabold text-emerald-400">
                            {snap.totalIsoDownloads.toLocaleString('en-US')} ISO download
                            {snap.totalIsoDownloads === 1 ? '' : 's'}
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-emerald-400"
                              style={{ width: `${heightPct}%` }}
                            />
                          </div>
                          <div className="zq-text-muted mt-2 font-mono text-[11px]">
                            Timestamp: {snap.timestamp}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View 3: Downloads per Day */}
              {activeTab === 'daily-growth' && (
                <div className="zq-surface-elevated rounded-2xl p-5">
                  <h4 className="zq-text-primary text-sm font-bold">
                    Daily Download Growth (Consecutive Daily Snapshots)
                  </h4>

                  {dailyGrowth.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-xs leading-relaxed">
                      <p className="font-semibold text-amber-300">
                        Awaiting Consecutive Multi-Day Snapshot Observations
                      </p>
                      <p className="zq-text-secondary mt-1">
                        Daily download deltas require at least two snapshots recorded on distinct
                        UTC calendar days. Currently, <strong>{snapshots.length}</strong> real
                        snapshot observation has been collected since release publication (
                        <code className="font-mono text-amber-200">
                          {snapshots[0]?.timestamp ?? 'today'}
                        </code>
                        ). No prior daily history is fabricated. Below is the current live download
                        count per release:
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {releases.map((r) => (
                          <div
                            key={r.id}
                            className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 font-mono text-xs"
                          >
                            <span className="text-white">{r.tagName}:</span>{' '}
                            <span className="font-bold text-emerald-400">
                              {r.totalIsoDownloads.toLocaleString('en-US')} cumulative ISO download
                              {r.totalIsoDownloads === 1 ? '' : 's'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {dailyGrowth.map((point) => (
                        <div
                          key={point.timestamp}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs"
                        >
                          <span className="text-slate-200">{point.dateLabel}</span>
                          <span className="font-bold text-emerald-400">
                            +{point.deltaIsoDownloads.toLocaleString('en-US')} ISO downloads (Total:{' '}
                            {point.cumulativeIsoDownloads.toLocaleString('en-US')})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* View 4: Downloads per Week */}
              {activeTab === 'weekly-growth' && (
                <div className="zq-surface-elevated rounded-2xl p-5">
                  <h4 className="zq-text-primary text-sm font-bold">
                    Weekly Download Growth (Consecutive ISO Weeks)
                  </h4>

                  {weeklyGrowth.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-xs leading-relaxed">
                      <p className="font-semibold text-amber-300">
                        Awaiting Consecutive Multi-Week Snapshot Observations
                      </p>
                      <p className="zq-text-secondary mt-1">
                        Weekly download growth calculations require snapshots across at least two
                        consecutive ISO calendar weeks. Because the first official Alpha release (
                        <code className="font-mono text-amber-200">v1.0.0-alfa</code>) was published
                        in the current week, weekly delta charts will appear automatically next week
                        without fabricated historical points.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {weeklyGrowth.map((point) => (
                        <div
                          key={point.dateLabel}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs"
                        >
                          <span className="text-slate-200">{point.dateLabel}</span>
                          <span className="font-bold text-blue-400">
                            +{point.deltaIsoDownloads.toLocaleString('en-US')} ISO downloads (Total:{' '}
                            {point.cumulativeIsoDownloads.toLocaleString('en-US')})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* View 5: Release-to-Release Comparison */}
              {activeTab === 'release-comparison' && (
                <div className="zq-surface-elevated rounded-2xl p-5">
                  <h4 className="zq-text-primary text-sm font-bold">
                    Release-to-Release Comparison Matrix
                  </h4>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-slate-700/70 text-slate-400">
                          <th className="py-2.5 pr-4">Release / Tag</th>
                          <th className="px-4 py-2.5">Channel</th>
                          <th className="px-4 py-2.5">ISO Downloads</th>
                          <th className="px-4 py-2.5">All Asset Downloads</th>
                          <th className="py-2.5 pl-4">Delta vs. Previous Release</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {releaseComparisons.map((item) => (
                          <tr key={item.tagName}>
                            <td className="py-3 pr-4 font-bold text-white">
                              {item.releaseName} ({item.tagName})
                            </td>
                            <td className="px-4 py-3 text-emerald-400">{item.channel}</td>
                            <td className="px-4 py-3 font-bold text-[#3B82F6]">
                              {item.isoDownloads.toLocaleString('en-US')}
                            </td>
                            <td className="px-4 py-3 text-slate-300">
                              {item.totalDownloads.toLocaleString('en-US')}
                            </td>
                            <td className="py-3 pl-4 text-slate-400">
                              {item.deltaFromPreviousRelease === null
                                ? 'Baseline (First Published Release)'
                                : `${item.deltaFromPreviousRelease >= 0 ? '+' : ''}${item.deltaFromPreviousRelease.toLocaleString('en-US')} ISO downloads`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
