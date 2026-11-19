import React from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  Cpu,
  ExternalLink,
  FileCheck2,
  GitCommit,
  HardDrive,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { uiText } from '@/data/i18n';
import { releaseInfoData } from '@/data/releases';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function DownloadsSection(): React.ReactElement {
  const reducedMotion = useReducedMotion();

  return (
    <section id="downloads" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={uiText.downloads.eyebrow}
          title={uiText.downloads.title}
          subtitle={uiText.downloads.subtitle}
        />

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-5xl"
        >
          <Card className="border-blue-500/40 p-6 sm:p-8">
            {/* Explicit "No public release available yet" State */}
            {!releaseInfoData.hasPublicRelease && (
              <div className="mb-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3.5">
                    <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-extrabold text-amber-300">
                          {uiText.downloads.noPublicReleaseTitle}
                        </h3>
                        <Badge variant="experimental" className="font-mono text-xs">
                          {uiText.downloads.noPublicReleaseBadge}
                        </Badge>
                      </div>
                      <p className="zq-text-secondary mt-2 text-xs leading-relaxed sm:text-sm">
                        {releaseInfoData.publicReleaseNotice}
                      </p>
                      <p className="mt-2 font-mono text-xs text-emerald-300">
                        {uiText.downloads.alphaMilestoneNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <GitCommit className="h-5 w-5 text-[#3B82F6]" />
                <h3 className="zq-text-primary text-lg font-bold">
                  {uiText.downloads.releaseMetadataTitle}
                </h3>
              </div>
              <Badge variant="completed" className="font-mono text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {uiText.downloads.statusLabel}: {releaseInfoData.status} (
                  {releaseInfoData.version})
                </span>
              </Badge>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="zq-surface-elevated rounded-xl p-4">
                <div className="zq-text-muted font-mono text-xs">
                  {uiText.downloads.versionLabel}
                </div>
                <div className="zq-text-primary mt-1 font-mono text-base font-bold">
                  {releaseInfoData.version} (Build {releaseInfoData.buildNumber})
                </div>
              </div>

              <div className="zq-surface-elevated rounded-xl p-4">
                <div className="zq-text-muted font-mono text-xs">
                  {uiText.downloads.tagDateLabel}
                </div>
                <div className="zq-text-primary mt-1 font-mono text-base font-bold">
                  {releaseInfoData.tagDate}
                </div>
              </div>

              <div className="zq-surface-elevated rounded-xl p-4">
                <div className="zq-text-muted font-mono text-xs">
                  {uiText.downloads.isoSizeLabel}
                </div>
                <div className="zq-text-primary mt-1 font-mono text-sm font-bold">
                  {releaseInfoData.isoSize}
                </div>
              </div>

              <div className="zq-surface-elevated rounded-xl p-4 sm:col-span-2">
                <div className="zq-text-muted flex items-center gap-1.5 font-mono text-xs">
                  <Cpu className="h-3.5 w-3.5 text-[#3B82F6]" />
                  <span>{uiText.downloads.architectureLabel}</span>
                </div>
                <div className="zq-text-primary mt-1 font-mono text-sm font-semibold">
                  {releaseInfoData.architecture}
                </div>
              </div>

              <div className="zq-surface-elevated rounded-xl p-4">
                <div className="zq-text-muted flex items-center gap-1.5 font-mono text-xs">
                  <HardDrive className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  <span>{uiText.downloads.kernelLabel}</span>
                </div>
                <div className="zq-text-primary mt-1 font-mono text-xs font-semibold">
                  {releaseInfoData.cosmosKernelVersion}
                </div>
              </div>
            </div>

            {/* SHA-256 & Verification Policy Box */}
            <div className="zq-surface-elevated mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl p-3.5 font-mono text-xs">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-400" />
                <span className="zq-text-secondary font-semibold">
                  {uiText.downloads.sha256Label}:
                </span>
              </div>
              <span className="zq-text-muted">
                Published alongside official ISO assets upon public GitHub Release sign-off
              </span>
            </div>

            {/* Verified Changelog */}
            <div className="mt-8">
              <h4 className="zq-text-primary text-base font-bold">
                {uiText.downloads.changelogTitle}
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
                {releaseInfoData.changelog.map((item, idx) => (
                  <li key={idx} className="zq-text-secondary flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Build From Source Hint + Official GitHub Links */}
            <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-500/20 pt-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Terminal className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                <span>{uiText.downloads.buildFromSourceHint}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  href={releaseInfoData.githubReleasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="md"
                >
                  <span>{uiText.downloads.viewGithubReleases}</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  href={`${releaseInfoData.githubRepoUrl}/releases/tag/${releaseInfoData.tagName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="md"
                >
                  <ShieldAlert className="h-4 w-4 text-[#3B82F6]" />
                  <span>{uiText.downloads.viewTagCommit}</span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
