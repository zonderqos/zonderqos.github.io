import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bug,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  GitBranch,
  HardDrive,
  Layers,
  PackageCheck,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  hardwareCompatibilityData,
  newsChangelogData,
  verifiedRepoMetrics,
} from '@/data/development';
import { uiText } from '@/data/i18n';
import { generationComparisonData } from '@/data/screenshots';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useReleases } from '@/hooks/useReleases';
import type { HardwareTestEntry } from '@/types/site';

function getHardwareBadgeVariant(status: HardwareTestEntry['cosmos3097Status']) {
  switch (status) {
    case 'Verified PASS':
      return 'implemented' as const;
    case 'Partial / Known Gap':
      return 'experimental' as const;
    case 'Unverified on 3.0.97':
      return 'inDevelopment' as const;
    case 'Blocked Locally':
      return 'blocked' as const;
  }
}

export function DevelopmentSection(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const { releases } = useReleases();
  const [copiedCommandIndex, setCopiedCommandIndex] = useState<number | null>(null);

  const handleCopyCommand = async (command: string, index: number) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommandIndex(index);
      window.setTimeout(() => setCopiedCommandIndex(null), 1800);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
  };

  return (
    <section id="development" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={uiText.development.eyebrow}
          title={uiText.development.title}
          subtitle={uiText.development.subtitle}
        />

        {/* Verified Repository Metrics (Non-Blocking Static Snapshot) */}
        <div className="mb-12">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="zq-text-primary flex items-center gap-2 text-lg font-bold">
              <GitBranch className="h-5 w-5 text-[#3B82F6]" />
              <span>{uiText.development.repoStatsTitle}</span>
            </h3>
            <span className="zq-text-muted font-mono text-xs">
              {uiText.development.repoStatsFallbackNote}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {verifiedRepoMetrics.map((metric) => (
              <Card key={metric.id} className="p-5">
                <div className="font-mono text-2xl font-extrabold text-[#3B82F6] sm:text-3xl">
                  {metric.value}
                </div>
                <div className="zq-text-primary mt-1 text-sm font-semibold">{metric.label}</div>
                <div className="zq-text-muted mt-1 font-mono text-xs">{metric.detail}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Architecture & QEMU Testing Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-2.5 text-[#3B82F6]">
                <Cpu className="h-5 w-5" />
                <h3 className="zq-text-primary text-xl font-bold">
                  {uiText.development.architectureTitle}
                </h3>
              </div>
              <p className="zq-text-secondary mt-3 text-sm leading-relaxed">
                {uiText.development.architectureBody}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="zq-surface-elevated rounded-xl p-3">
                  <div className="text-blue-400">source/Platform/X64</div>
                  <div className="zq-text-muted mt-1">NASM • PIT Ch2 Speaker • PCI Sysfs</div>
                </div>
                <div className="zq-surface-elevated rounded-xl p-3">
                  <div className="text-purple-400">source/Platform/Arm64</div>
                  <div className="zq-text-muted mt-1">GAS • GICv3 • PL011 • ACPI/ECAM</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="zq-text-primary text-xl font-bold">
                  {uiText.development.qemuTestingTitle}
                </h3>
              </div>
              <p className="zq-text-secondary mt-3 text-sm leading-relaxed">
                {uiText.development.qemuTestingBody}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="zq-surface-elevated rounded-xl p-3">
                  <div className="text-emerald-400">565 Passed + 200 Subtests</div>
                  <div className="zq-text-muted mt-1">85 Python QMP / Contract Suites</div>
                </div>
                <div className="zq-surface-elevated rounded-xl p-3">
                  <div className="text-cyan-400">23 Host Smoke Projects</div>
                  <div className="zq-text-muted mt-1">UpdateEngineSmoke • ACL • VFS</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Developer Quick Start Commands + Synchronized Live Public Releases & News Panel */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* Quick Start */}
          <Card className="lg:col-span-7">
            <div className="flex items-center gap-2.5">
              <Terminal className="h-5 w-5 text-[#3B82F6]" />
              <h3 className="zq-text-primary text-xl font-bold">
                {uiText.development.quickStartTitle}
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              {uiText.development.quickStartSteps.map((item, idx) => (
                <div key={idx} className="zq-surface-elevated rounded-xl p-4">
                  <div className="zq-text-primary text-xs font-bold sm:text-sm">{item.step}</div>
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-[#060911] px-3.5 py-2.5 font-mono text-xs text-blue-300">
                    <code className="overflow-x-auto">{item.command}</code>
                    <button
                      type="button"
                      onClick={() => handleCopyCommand(item.command, idx)}
                      aria-label={`Copy command: ${item.command}`}
                      className="shrink-0 rounded-md border border-slate-700 bg-slate-800/80 p-1.5 text-slate-300 transition hover:border-blue-500 hover:text-white cursor-pointer"
                    >
                      {copiedCommandIndex === idx ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="zq-text-muted mt-2 text-xs">{item.note}</p>
                </div>
              ))}
            </div>

            {/* Links to Source Code, Bug Tracker, GitHub Commit History & Docs */}
            <div className="mt-6 border-t border-slate-500/20 pt-5">
              <h4 className="zq-text-primary text-sm font-bold">{uiText.development.linksTitle}</h4>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button
                  href="https://github.com/dwierzbicki11/ZOnderqOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                >
                  <span>{uiText.development.sourceCodeLink}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button
                  href="https://github.com/dwierzbicki11/ZOnderqOS/commits/main"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="sm"
                >
                  <GitBranch className="h-3.5 w-3.5 text-[#3B82F6]" />
                  <span>GitHub Commit History</span>
                </Button>
                <Button
                  href="https://github.com/dwierzbicki11/ZOnderqOS/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="sm"
                >
                  <Bug className="h-3.5 w-3.5 text-rose-400" />
                  <span>{uiText.development.reportIssueLink}</span>
                </Button>
                <Button
                  href="https://github.com/zonderqos/zonderqos.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="sm"
                >
                  <span>{uiText.development.docsLink}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Synchronized Recent Public GitHub Releases + Engineering News Panel */}
          <Card className="lg:col-span-5">
            <h3 className="zq-text-primary text-xl font-bold">
              {uiText.development.changelogPanelTitle}
            </h3>

            {/* Live Public GitHub Releases Box */}
            {releases.length > 0 && (
              <div className="mt-4 space-y-3">
                {releases.slice(0, 2).map((rel) => (
                  <div
                    key={rel.id}
                    className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="implemented" className="font-mono text-[11px]">
                        <PackageCheck className="h-3 w-3" />
                        <span>Live GitHub Release: {rel.tagName}</span>
                      </Badge>
                      <span className="font-mono text-xs text-emerald-300">
                        {new Date(rel.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h4 className="zq-text-primary mt-2 text-sm font-extrabold">{rel.name}</h4>
                    <p className="zq-text-secondary mt-1 line-clamp-3 text-xs leading-relaxed">
                      {rel.bodyMarkdown.split('\n').slice(0, 4).join(' ')}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span className="text-emerald-300">
                        ISO Downloads: <strong>{rel.totalIsoDownloads}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        {rel.primaryIsoAsset && (
                          <a
                            href={rel.primaryIsoAsset.browserDownloadUrl}
                            className="inline-flex items-center gap-1 text-blue-300 hover:underline"
                          >
                            <Download className="h-3 w-3" />
                            <span>{rel.primaryIsoAsset.name}</span>
                          </a>
                        )}
                        <a
                          href={rel.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-300 hover:text-white hover:underline"
                        >
                          <span>Release Notes</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 space-y-4">
              {newsChangelogData.map((news) => (
                <div key={news.id} className="zq-surface-elevated rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="default" className="font-mono text-[11px]">
                      {news.versionTag}
                    </Badge>
                    <span className="zq-text-muted font-mono text-xs">{news.date}</span>
                  </div>
                  <h4 className="zq-text-primary mt-2 text-sm font-bold">{news.title}</h4>
                  <p className="zq-text-secondary mt-1 text-xs leading-relaxed">{news.summary}</p>
                  <ul className="mt-2.5 space-y-1 text-xs">
                    {news.highlights.map((hl, i) => (
                      <li key={i} className="zq-text-muted flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Confirmed Hardware Compatibility Table */}
        <div className="mt-14">
          <div className="mb-6">
            <h3 className="zq-text-primary flex items-center gap-2 text-2xl font-bold">
              <HardDrive className="h-6 w-6 text-[#3B82F6]" />
              <span>{uiText.development.hardwareTableTitle}</span>
            </h3>
            <p className="zq-text-secondary mt-1 text-sm">
              {uiText.development.hardwareTableSubtitle}
            </p>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-700/70 bg-slate-900/80 font-mono text-xs text-slate-300">
                    <th className="px-4 py-3.5">{uiText.development.hardwareColumns.platform}</th>
                    <th className="px-4 py-3.5">{uiText.development.hardwareColumns.cpuArch}</th>
                    <th className="px-4 py-3.5">{uiText.development.hardwareColumns.firmware}</th>
                    <th className="px-4 py-3.5">{uiText.development.hardwareColumns.display}</th>
                    <th className="px-4 py-3.5">{uiText.development.hardwareColumns.status3097}</th>
                    <th className="px-4 py-3.5">{uiText.development.hardwareColumns.notes}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {hardwareCompatibilityData.map((entry) => (
                    <tr key={entry.id} className="transition hover:bg-slate-800/30">
                      <td className="px-4 py-4 font-semibold">
                        <div className="zq-text-primary">{entry.platform}</div>
                        <div className="zq-text-muted mt-0.5 font-mono text-[11px]">
                          {entry.category}
                        </div>
                      </td>
                      <td className="zq-text-secondary px-4 py-4 font-mono text-xs">
                        {entry.cpuAndArch}
                      </td>
                      <td className="zq-text-secondary px-4 py-4 text-xs">
                        <div>{entry.firmwareAndBoot}</div>
                        <div className="zq-text-muted mt-1 font-mono text-[11px]">
                          {entry.storageAndInput}
                        </div>
                      </td>
                      <td className="zq-text-secondary px-4 py-4 font-mono text-xs">
                        {entry.displayMode}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={getHardwareBadgeVariant(entry.cosmos3097Status)}>
                          {entry.cosmos3097Status}
                        </Badge>
                      </td>
                      <td className="zq-text-secondary max-w-md px-4 py-4 text-xs leading-relaxed">
                        {entry.verifiedNotes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Dedicated Gen1, Gen2, Gen3 Architectural Evolution Matrix */}
        <div className="mt-14">
          <div className="mb-6">
            <h3 className="zq-text-primary flex items-center gap-2 text-2xl font-bold">
              <Layers className="h-6 w-6 text-[#8B5CF6]" />
              <span>{uiText.development.evolutionTitle}</span>
            </h3>
            <p className="zq-text-secondary mt-1 text-sm">{uiText.development.evolutionSubtitle}</p>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-700/70 bg-slate-900/80 font-mono text-xs text-slate-300">
                    <th className="px-4 py-3.5">Generation</th>
                    <th className="px-4 py-3.5">Compiler & AOT Stack</th>
                    <th className="px-4 py-3.5">Architecture</th>
                    <th className="px-4 py-3.5">Bootloader & Display</th>
                    <th className="px-4 py-3.5">Memory & GC</th>
                    <th className="px-4 py-3.5">Storage & Subsystems</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {generationComparisonData.map((gen) => (
                    <tr key={gen.generation} className="transition hover:bg-slate-800/30">
                      <td className="px-4 py-4">
                        <Badge
                          variant={gen.generation === 'Gen3' ? 'implemented' : 'outline'}
                          className="font-mono"
                        >
                          {gen.generation}
                        </Badge>
                        <div className="zq-text-primary mt-1 font-bold">{gen.codename}</div>
                      </td>
                      <td className="zq-text-secondary px-4 py-4 font-mono text-xs">
                        {gen.compilerAndRuntime}
                      </td>
                      <td className="zq-text-secondary px-4 py-4 font-mono text-xs">
                        {gen.architecture}
                      </td>
                      <td className="zq-text-secondary px-4 py-4 text-xs">{gen.bootAndDisplay}</td>
                      <td className="zq-text-secondary px-4 py-4 text-xs">{gen.memoryAndGc}</td>
                      <td className="zq-text-secondary px-4 py-4 text-xs">
                        {gen.storageAndDrivers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
