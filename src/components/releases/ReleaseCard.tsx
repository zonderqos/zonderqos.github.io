import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Disc,
  Download,
  ExternalLink,
  FileArchive,
  FileCheck2,
  GitBranch,
  Tag,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { parseAndSanitizeReleaseNotes } from '@/lib/releaseFormatters';
import type { NormalizedRelease } from '@/types/releases';

interface ReleaseCardProps {
  release: NormalizedRelease;
  isLatest?: boolean;
  defaultExpanded?: boolean;
}

export function ReleaseCard({
  release,
  isLatest = false,
  defaultExpanded = true,
}: ReleaseCardProps): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(defaultExpanded);
  const [copiedSha, setCopiedSha] = useState<boolean>(false);

  const parsedSections = useMemo(
    () => parseAndSanitizeReleaseNotes(release.bodyMarkdown),
    [release.bodyMarkdown],
  );

  const primaryIso = release.primaryIsoAsset;

  const handleCopySha = async (sha: string) => {
    try {
      await navigator.clipboard.writeText(sha);
      setCopiedSha(true);
      window.setTimeout(() => setCopiedSha(false), 1800);
    } catch {
      // Ignore clipboard restriction
    }
  };

  const formattedPublishedDate = release.publishedAt
    ? new Date(release.publishedAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : 'Unknown date';

  return (
    <Card className="overflow-hidden border-blue-500/40 p-0">
      {/* Top Release Header */}
      <div className="p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            {/* Classification & Prerelease Badges (Kept Explicitly Separate) */}
            <div className="flex flex-wrap items-center gap-2">
              {isLatest && (
                <Badge variant="implemented" className="font-mono text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Latest Official Release</span>
                </Badge>
              )}
              <Badge variant="completed" className="font-mono text-xs">
                Development Phase: {release.channel} (Completed)
              </Badge>
              <Badge
                variant={release.isGitHubPrerelease ? 'experimental' : 'default'}
                className="font-mono text-xs"
              >
                GitHub Prerelease: {release.isGitHubPrerelease ? 'true' : 'false (Public Release)'}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                <Tag className="h-3 w-3 text-[#3B82F6]" />
                <span>{release.tagName}</span>
              </Badge>
            </div>

            {/* Release Name */}
            <h3 className="zq-text-primary mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {release.name}
            </h3>

            {/* Metadata Strip: Date, Author, Target Branch */}
            <div className="zq-text-muted mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#3B82F6]" />
                <span>Published: {formattedPublishedDate}</span>
              </span>
              <a
                href={release.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-300 transition hover:text-blue-200 hover:underline"
              >
                {release.authorAvatarUrl ? (
                  <img
                    src={release.authorAvatarUrl}
                    alt={release.authorLogin}
                    className="h-4 w-4 rounded-full"
                    loading="lazy"
                  />
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
                <span>Author: @{release.authorLogin}</span>
              </a>
              <span className="inline-flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-[#8B5CF6]" />
                <span>Target: {release.targetCommitish}</span>
              </span>
            </div>
          </div>

          {/* Primary Actions: Direct Download ISO (browser_download_url) + View Release */}
          <div className="flex flex-wrap items-center gap-3">
            {primaryIso && (
              <Button href={primaryIso.browserDownloadUrl} variant="primary" size="lg">
                <Download className="h-4 w-4" />
                <span>
                  Download ISO ({primaryIso.name} • {primaryIso.sizeFormatted.mb})
                </span>
              </Button>
            )}
            <Button
              href={release.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
            >
              <span>View Release on GitHub</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Telemetry Strip for This Release */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="zq-surface-elevated rounded-xl p-3.5">
            <div className="zq-text-muted font-mono text-[11px] uppercase">
              Bootable ISO File Name
            </div>
            <div className="zq-text-primary mt-1 flex items-center gap-1.5 font-mono text-sm font-bold">
              <Disc className="h-4 w-4 text-[#3B82F6]" />
              <span>{primaryIso ? primaryIso.name : 'No ISO asset attached'}</span>
            </div>
          </div>

          <div className="zq-surface-elevated rounded-xl p-3.5">
            <div className="zq-text-muted font-mono text-[11px] uppercase">ISO Size (MB / MiB)</div>
            <div className="zq-text-primary mt-1 font-mono text-sm font-bold">
              {primaryIso
                ? `${primaryIso.sizeFormatted.combined} (${primaryIso.sizeBytes.toLocaleString('en-US')} B)`
                : 'N/A'}
            </div>
          </div>

          <div className="zq-surface-elevated rounded-xl p-3.5">
            <div className="zq-text-muted font-mono text-[11px] uppercase">
              ISO Asset Download Count
            </div>
            <div className="mt-1 font-mono text-base font-extrabold text-emerald-400">
              {release.totalIsoDownloads.toLocaleString('en-US')} download
              {release.totalIsoDownloads === 1 ? '' : 's'}
            </div>
          </div>

          <div className="zq-surface-elevated rounded-xl p-3.5">
            <div className="zq-text-muted font-mono text-[11px] uppercase">
              Total Downloads (All Assets)
            </div>
            <div className="mt-1 font-mono text-base font-extrabold text-[#3B82F6]">
              {release.totalAssetDownloads.toLocaleString('en-US')} across {release.assets.length}{' '}
              asset{release.assets.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        {/* SHA-256 Checksum Bar (from real GitHub API asset.digest) */}
        {primaryIso && primaryIso.sha256 && (
          <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-3.5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-2.5 overflow-hidden">
              <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div className="min-w-0">
                <div className="font-mono text-xs font-semibold text-emerald-300">
                  Official SHA-256 Digest ({primaryIso.name}):
                </div>
                <code className="mt-0.5 block break-all font-mono text-xs text-slate-200">
                  {primaryIso.sha256}
                </code>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopySha(primaryIso.sha256!)}
              aria-label={`Copy SHA-256 checksum for ${primaryIso.name}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-slate-900/85 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 cursor-pointer"
            >
              {copiedSha ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied SHA-256</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy SHA-256</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Expand/Collapse Toggle Button */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-500/20 pt-4">
          <span className="zq-text-muted font-mono text-xs">
            Release ID: #{release.id} • Direct GitHub Asset Hosting (Preserves Native Download
            Counter)
          </span>
          <button
            type="button"
            onClick={() => setIsDetailsExpanded((prev) => !prev)}
            aria-expanded={isDetailsExpanded}
            aria-controls={`release-details-${release.id}`}
            className="zq-surface-elevated zq-text-secondary hover:zq-text-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition hover:border-blue-500/50 cursor-pointer"
          >
            <span>
              {isDetailsExpanded
                ? 'Hide Release Notes & Asset Details'
                : 'Show Full Release Notes & Asset Details'}
            </span>
            {isDetailsExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Full Release Notes, Individual Assets & Separated Source Code Archives */}
      <AnimatePresence initial={false}>
        {isDetailsExpanded && (
          <motion.div
            id={`release-details-${release.id}`}
            initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-500/20 bg-slate-950/35"
          >
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-12">
              {/* Left 7 Cols: Full Sanitized Markdown Release Notes */}
              <div className="space-y-5 lg:col-span-7">
                <h4 className="zq-text-primary font-mono text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                  Full Release Notes ({release.tagName})
                </h4>

                {parsedSections.length === 0 ? (
                  <p className="zq-text-muted text-sm">
                    No release notes body provided in this GitHub release.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {parsedSections.map((sec, sIdx) => (
                      <div key={sIdx} className="zq-surface-elevated rounded-2xl p-4 sm:p-5">
                        {sec.heading && (
                          <h5 className="zq-text-primary mb-3 border-b border-slate-500/20 pb-2 text-sm font-extrabold uppercase tracking-wide text-blue-300">
                            {sec.heading}
                          </h5>
                        )}
                        <div className="space-y-2.5 text-xs sm:text-sm">
                          {sec.lines.map((line, lIdx) => {
                            if (line.type === 'feature') {
                              return (
                                <div key={lIdx} className="flex items-start gap-2.5">
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                                  <div className="zq-text-secondary">
                                    <strong className="zq-text-primary">{line.title}</strong> —{' '}
                                    {line.text}
                                  </div>
                                </div>
                              );
                            }
                            if (line.type === 'status') {
                              const isDone = line.text.toLowerCase().includes('completed');
                              return (
                                <div
                                  key={lIdx}
                                  className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 font-mono text-xs"
                                >
                                  <span className="font-semibold text-slate-200">{line.title}</span>
                                  <Badge variant={isDone ? 'completed' : 'default'}>
                                    {line.text}
                                  </Badge>
                                </div>
                              );
                            }
                            return (
                              <p
                                key={lIdx}
                                className="zq-text-secondary leading-relaxed first:font-semibold first:zq-text-primary"
                              >
                                {line.text}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right 5 Cols: Release Assets & Separated Source Code Archives */}
              <div className="space-y-5 lg:col-span-5">
                {/* Downloadable Binary Assets */}
                <div className="zq-surface-elevated rounded-2xl p-4 sm:p-5">
                  <h4 className="zq-text-primary font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Downloadable Release Assets ({release.assets.length})
                  </h4>

                  {release.assets.length === 0 ? (
                    <p className="zq-text-muted mt-3 text-xs">
                      No downloadable binary assets attached to this release.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {release.assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="rounded-xl border border-slate-700/70 bg-slate-900/80 p-3.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-white">
                              {asset.name}
                            </span>
                            <Badge
                              variant={asset.isIso ? 'implemented' : 'default'}
                              className="font-mono text-[10px]"
                            >
                              {asset.category}
                            </Badge>
                          </div>

                          <div className="zq-text-muted mt-2 grid grid-cols-2 gap-2 font-mono text-[11px]">
                            <div>Size: {asset.sizeFormatted.combined}</div>
                            <div>
                              Downloads:{' '}
                              <strong className="text-emerald-400">
                                {asset.downloadCount.toLocaleString('en-US')}
                              </strong>
                            </div>
                            <div className="col-span-2 truncate">
                              MIME: {asset.contentType} • State: {asset.state}
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Button
                              href={asset.browserDownloadUrl}
                              variant="primary"
                              size="sm"
                              className="w-full"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Direct Download ({asset.name})</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clearly Separated Source Code Archives */}
                <div className="zq-surface-elevated rounded-2xl border border-dashed border-slate-600/60 p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <FileArchive className="h-4 w-4 text-purple-400" />
                    <h4 className="zq-text-primary font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
                      Source Code Archives (Non-Bootable)
                    </h4>
                  </div>
                  <p className="zq-text-muted mt-1.5 text-xs leading-relaxed">
                    GitHub-generated source tree snapshots for tag{' '}
                    <code className="font-mono text-purple-300">{release.tagName}</code>. These
                    contain C# source files, not bootable ISO images, and are excluded from ISO
                    download counters.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <Button
                      href={release.githubWebZipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="sm"
                    >
                      <FileArchive className="h-3.5 w-3.5 text-purple-400" />
                      <span>Source Code (.zip)</span>
                    </Button>
                    <Button
                      href={release.githubWebTarGzUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="sm"
                    >
                      <FileArchive className="h-3.5 w-3.5 text-purple-400" />
                      <span>Source Code (.tar.gz)</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
