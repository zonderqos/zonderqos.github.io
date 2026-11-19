import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  PackageOpen,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import { DownloadAnalyticsPanel } from '@/components/releases/DownloadAnalyticsPanel';
import { FileIntegrityPanel } from '@/components/releases/FileIntegrityPanel';
import { ReleaseAssetExplorer } from '@/components/releases/ReleaseAssetExplorer';
import { ReleaseCard } from '@/components/releases/ReleaseCard';
import { ReleaseStatsOverview } from '@/components/releases/ReleaseStatsOverview';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useReleases } from '@/hooks/useReleases';
import { GITHUB_RELEASES_API_URL } from '@/lib/githubReleasesClient';
import { cn } from '@/lib/utils';

export function DownloadsSection(): React.ReactElement {
  const {
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
    errorMessage,
    refreshReleases,
  } = useReleases();

  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    : 'Synchronizing...';

  return (
    <section id="downloads" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Official Release Center & Telemetry"
          title="GitHub Releases, Direct ISO Downloads & Statistics"
          subtitle="Synchronized automatically with the official ZonderqOS GitHub Releases REST API. Download bootable ISO images directly from GitHub Releases, inspect cumulative download statistics, explore release assets, and verify SHA-256 checksums."
        />

        {/* Synchronization Status & Manual Refresh Bar */}
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-slate-700/70 bg-[#0D1322] p-4 sm:flex-row sm:items-center sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            {isStaleCache ? (
              <Badge variant="experimental" className="font-mono text-xs">
                <WifiOff className="h-3.5 w-3.5" />
                <span>Offline / Stale Cache Fallback</span>
              </Badge>
            ) : (
              <Badge variant="implemented" className="font-mono text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{fromCache ? 'Synchronized (Cached)' : 'Live GitHub Releases API'}</span>
              </Badge>
            )}

            <span className="zq-text-muted inline-flex items-center gap-1.5 font-mono text-xs">
              <Clock className="h-3.5 w-3.5 text-[#3B82F6]" />
              <span>Last Updated: {formattedLastUpdated}</span>
            </span>

            {pagesFetched > 0 && (
              <span className="zq-text-muted hidden font-mono text-xs md:inline">
                • {pagesFetched} API page{pagesFetched === 1 ? '' : 's'} scanned
              </span>
            )}

            {rateLimitRemaining !== null && (
              <span className="zq-text-muted hidden font-mono text-xs lg:inline">
                • API Quota Remaining: {rateLimitRemaining}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => void refreshReleases()}
              disabled={isLoading || isRefreshing}
              aria-label="Refresh GitHub Releases data now"
              className="zq-surface-elevated zq-text-primary inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold transition hover:border-blue-500/60 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={cn(
                  'h-3.5 w-3.5 text-[#3B82F6]',
                  (isLoading || isRefreshing) && 'animate-spin',
                )}
              />
              <span>{isRefreshing ? 'Refreshing API...' : 'Refresh Data'}</span>
            </button>

            <Button
              href="https://github.com/dwierzbicki11/ZOnderqOS/releases"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="sm"
            >
              <span>GitHub Releases</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Error / Rate Limit / Stale Cache Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs sm:text-sm"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <div className="font-bold text-amber-300">
                {isStaleCache
                  ? 'Serving Cached Release Data (Stale Fallback Active)'
                  : 'GitHub Releases API Synchronization Notice'}
              </div>
              <p className="zq-text-secondary mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && releases.length === 0 ? (
          <div className="space-y-6" aria-busy="true" aria-label="Loading GitHub Releases data">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <Card key={n} className="h-32 animate-pulse bg-slate-900/60">
                  <div className="h-3 w-28 rounded bg-slate-800" />
                  <div className="mt-4 h-8 w-20 rounded bg-slate-800" />
                  <div className="mt-3 h-2.5 w-40 rounded bg-slate-800" />
                </Card>
              ))}
            </div>
            <Card className="h-72 animate-pulse bg-slate-900/60">
              <div className="h-5 w-48 rounded bg-slate-800" />
              <div className="mt-4 h-8 w-64 rounded bg-slate-800" />
              <div className="mt-6 h-32 w-full rounded-xl bg-slate-800" />
            </Card>
          </div>
        ) : releases.length === 0 ? (
          /* Empty Release List Fallback */
          <Card className="border-amber-500/35 p-8 text-center">
            <PackageOpen className="mx-auto h-12 w-12 text-amber-400" />
            <h3 className="zq-text-primary mt-4 text-xl font-extrabold">
              No Public Releases Returned by GitHub API
            </h3>
            <p className="zq-text-secondary mx-auto mt-2 max-w-xl text-sm">
              The query to{' '}
              <code className="font-mono text-blue-300">{GITHUB_RELEASES_API_URL}</code> currently
              returned zero published releases. Check the official GitHub Releases page or click
              Refresh Data above.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={() => void refreshReleases()} variant="primary" size="md">
                <RefreshCw className="h-4 w-4" />
                <span>Retry API Fetch</span>
              </Button>
              <Button
                href="https://github.com/dwierzbicki11/ZOnderqOS/releases"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="md"
              >
                <span>Open GitHub Releases</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-10">
            {/* 1. Download Statistics Dashboard */}
            <ReleaseStatsOverview stats={stats} />

            {/* 2. Historical Download Analytics & Version Comparisons */}
            <DownloadAnalyticsPanel releases={releases} snapshots={snapshots} />

            {/* 3. Published Releases & Full Release History */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="zq-text-primary text-2xl font-extrabold">
                    Published Releases & Release History ({releases.length})
                  </h3>
                  <p className="zq-text-secondary mt-1 text-xs sm:text-sm">
                    Direct ISO downloads use official{' '}
                    <code className="font-mono text-blue-300">asset.browser_download_url</code>{' '}
                    endpoints on GitHub Releases so every download increments GitHub&apos;s native
                    counter.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {releases.map((release, index) => (
                  <ReleaseCard
                    key={release.id}
                    release={release}
                    isLatest={index === 0}
                    defaultExpanded={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* 4. Complete Release Asset Explorer */}
            <ReleaseAssetExplorer releases={releases} />

            {/* 5. File Integrity Verification Panel (SHA-256 Linux & Windows) */}
            <FileIntegrityPanel releases={releases} />
          </div>
        )}
      </div>
    </section>
  );
}
