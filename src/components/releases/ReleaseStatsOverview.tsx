import React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  BarChart3,
  Disc,
  Download,
  ExternalLink,
  Info,
  PackageCheck,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ReleaseDashboardStats } from '@/types/releases';

interface ReleaseStatsOverviewProps {
  stats: ReleaseDashboardStats;
}

export function ReleaseStatsOverview({ stats }: ReleaseStatsOverviewProps): React.ReactElement {
  const reducedMotion = useReducedMotion();

  const maxDownloadsInChart = Math.max(
    1,
    ...stats.downloadsByVersion.map((v) => Math.max(v.isoDownloads, v.totalDownloads)),
  );

  return (
    <div className="space-y-6">
      {/* 4 Primary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-blue-500/35 p-5">
          <div className="flex items-center justify-between">
            <span className="zq-text-muted font-mono text-xs font-semibold uppercase">
              Total ISO Downloads
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-[#3B82F6]">
              <Download className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-mono text-3xl font-extrabold text-[#3B82F6] sm:text-4xl">
            <AnimatedCounter value={stats.totalIsoDownloads} />
          </div>
          <p className="zq-text-muted mt-1.5 text-xs">
            Cumulative ISO <code className="text-blue-300">download_count</code> across all
            published releases
          </p>
        </Card>

        <Card className="relative overflow-hidden border-emerald-500/35 p-5">
          <div className="flex items-center justify-between">
            <span className="zq-text-muted font-mono text-xs font-semibold uppercase">
              Latest Release Downloads
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-mono text-3xl font-extrabold text-emerald-400 sm:text-4xl">
            <AnimatedCounter value={stats.latestReleaseIsoDownloads} />
          </div>
          <p className="zq-text-muted mt-1.5 text-xs">
            {stats.latestDownloadableRelease
              ? `ISO downloads for ${stats.latestDownloadableRelease.name} (${stats.latestDownloadableRelease.tagName})`
              : 'No downloadable ISO published yet'}
          </p>
        </Card>

        <Card className="relative overflow-hidden border-purple-500/35 p-5">
          <div className="flex items-center justify-between">
            <span className="zq-text-muted font-mono text-xs font-semibold uppercase">
              Total Published Releases
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
              <PackageCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-mono text-3xl font-extrabold text-purple-400 sm:text-4xl">
            <AnimatedCounter value={stats.totalPublishedReleases} />
          </div>
          <p className="zq-text-muted mt-1.5 text-xs">
            Retrieved from all paginated GitHub Releases API pages
          </p>
        </Card>

        <Card className="relative overflow-hidden border-cyan-500/35 p-5">
          <div className="flex items-center justify-between">
            <span className="zq-text-muted font-mono text-xs font-semibold uppercase">
              Available ISO Images
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
              <Disc className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-mono text-3xl font-extrabold text-cyan-400 sm:text-4xl">
            <AnimatedCounter value={stats.availableIsoImagesCount} />
          </div>
          <p className="zq-text-muted mt-1.5 text-xs">
            Publicly downloadable bootable <code className="text-cyan-300">.iso</code> release
            assets
          </p>
        </Card>
      </div>

      {/* Important Metric Semantics Notice */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-xs">
        <Info className="h-4 w-4 shrink-0 text-[#3B82F6]" />
        <span className="zq-text-secondary">
          <strong>Telemetry Accuracy Note:</strong> GitHub&apos;s cumulative{' '}
          <code className="font-mono text-blue-300">download_count</code> measures total direct
          asset download events from GitHub Releases, not unique users, active installations, or
          website visitors.
        </span>
      </div>

      {/* Most Downloaded Release + Downloads by Version & Share */}
      {stats.totalPublishedReleases > 0 && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Most Downloaded Release Spotlight */}
          {stats.mostDownloadedRelease && (
            <Card className="flex flex-col justify-between border-amber-500/35 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="experimental" className="font-mono text-xs">
                    <Award className="h-3.5 w-3.5" />
                    <span>Most Downloaded Release</span>
                  </Badge>
                  <Badge variant="completed" className="font-mono text-xs">
                    {stats.mostDownloadedRelease.release.channel} Channel
                  </Badge>
                </div>

                <h3 className="zq-text-primary mt-4 text-xl font-extrabold">
                  {stats.mostDownloadedRelease.release.name}
                </h3>
                <p className="mt-0.5 font-mono text-xs text-[#3B82F6]">
                  Tag: {stats.mostDownloadedRelease.release.tagName} • Published{' '}
                  {new Date(stats.mostDownloadedRelease.release.publishedAt).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    },
                  )}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="zq-surface-elevated rounded-xl p-3">
                    <div className="zq-text-muted font-mono text-[11px] uppercase">
                      Cumulative ISO Downloads
                    </div>
                    <div className="mt-1 font-mono text-2xl font-extrabold text-emerald-400">
                      {stats.mostDownloadedRelease.isoDownloads.toLocaleString('en-US')}
                    </div>
                  </div>
                  <div className="zq-surface-elevated rounded-xl p-3">
                    <div className="zq-text-muted font-mono text-[11px] uppercase">
                      Primary ISO Size
                    </div>
                    <div className="zq-text-primary mt-1 font-mono text-sm font-bold">
                      {stats.mostDownloadedRelease.release.primaryIsoAsset?.sizeFormatted
                        .combined ?? 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-slate-500/15 pt-4">
                {stats.mostDownloadedRelease.release.primaryIsoAsset && (
                  <Button
                    href={stats.mostDownloadedRelease.release.primaryIsoAsset.browserDownloadUrl}
                    variant="primary"
                    size="sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download {stats.mostDownloadedRelease.release.primaryIsoAsset.name}</span>
                  </Button>
                )}
                <Button
                  href={stats.mostDownloadedRelease.release.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="sm"
                >
                  <span>Release Page</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          )}

          {/* Downloads by Version & Download Share by Version */}
          <Card className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#3B82F6]" />
                <h3 className="zq-text-primary text-base font-bold">
                  Downloads by Version & Share Distribution
                </h3>
              </div>
              <span className="zq-text-muted inline-flex items-center gap-1 font-mono text-xs">
                <PieChart className="h-3.5 w-3.5 text-[#8B5CF6]" />
                {stats.downloadsByVersion.length} release(s)
              </span>
            </div>

            {/* Version Comparison Bars */}
            <div className="mt-5 space-y-4">
              {stats.downloadsByVersion.map((v) => {
                const widthPercent = Math.max(
                  6,
                  Math.round((v.isoDownloads / maxDownloadsInChart) * 100),
                );
                return (
                  <div key={v.releaseId} className="zq-surface-elevated rounded-xl p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="zq-text-primary font-bold">{v.releaseName}</span>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {v.tagName}
                        </Badge>
                        <Badge variant="completed" className="font-mono text-[10px]">
                          {v.channel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="font-bold text-[#3B82F6]">
                          {v.isoDownloads.toLocaleString('en-US')} ISO download
                          {v.isoDownloads === 1 ? '' : 's'}
                        </span>
                        <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[11px] font-semibold text-purple-300">
                          {v.sharePercentage}% share
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <motion.div
                        initial={reducedMotion ? false : { width: 0 }}
                        whileInView={{ width: `${widthPercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
                      />
                    </div>

                    <div className="zq-text-muted mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span>
                        Asset: {v.primaryIsoName ?? 'No ISO'} ({v.primaryIsoSize ?? 'No binary ISO'}
                        )
                      </span>
                      <span>
                        GitHub Prerelease Flag:{' '}
                        {v.isGitHubPrerelease ? 'true (Prerelease)' : 'false (Public Release)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
