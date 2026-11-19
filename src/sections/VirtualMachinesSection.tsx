import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  Bug,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Disc,
  Download,
  ExternalLink,
  HardDrive,
  Info,
  Layers,
  Monitor,
  Package,
  Server,
  ShieldAlert,
  Terminal,
  Usb,
  Wrench,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  limineBootEntriesData,
  platformGuidesData,
  recommendedVmSpecsData,
  vmTroubleshootingData,
} from '@/data/installationGuide';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useReleases } from '@/hooks/useReleases';
import { cn } from '@/lib/utils';
import { detectVmPackageAssets } from '@/lib/vmAssetDetector';
import type { HypervisorVerificationLevel, VmPlatformId } from '@/types/installation';

function getVerificationBadgeVariant(level: HypervisorVerificationLevel) {
  switch (level) {
    case 'Verified in Automated CI (Primary Target)':
      return 'implemented' as const;
    case 'Experimental / Community Hypervisor Target':
      return 'experimental' as const;
    case 'Physical UEFI Target (USB)':
      return 'inDevelopment' as const;
  }
}

function getPlatformIcon(id: VmPlatformId) {
  switch (id) {
    case 'virtualbox':
      return Monitor;
    case 'vmware':
      return Layers;
    case 'qemu':
      return Terminal;
    case 'physical-usb':
      return Usb;
  }
}

export function VirtualMachinesSection(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const { stats } = useReleases();
  const [selectedPlatform, setSelectedPlatform] = useState<VmPlatformId>('virtualbox');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const latestRelease = stats.latestDownloadableRelease;
  const detectedPackages = detectVmPackageAssets(latestRelease?.assets ?? []);
  const activeGuide =
    platformGuidesData.find((p) => p.id === selectedPlatform) ?? platformGuidesData[0];

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Ignore clipboard restriction
    }
  };

  return (
    <section id="virtual-machines" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Virtualization & Bare-Metal Setup"
          title="Virtual Machines & USB Installation Guide"
          subtitle="Step-by-step instructions for running ZonderqOS on Oracle VirtualBox, VMware Workstation, QEMU/KVM on Linux, and physical UEFI computers via bootable USB."
        />

        {/* Experimental Hypervisor & Storage Policy Disclaimer Banner */}
        <div className="mx-auto mb-12 max-w-5xl rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div className="text-xs leading-relaxed sm:text-sm">
              <div className="font-bold text-amber-300">
                Hypervisor Compatibility & Storage Preparation Notice
              </div>
              <p className="zq-text-secondary mt-1">
                <strong>QEMU/KVM (x86_64 q35 + ICH9 AHCI + xHCI)</strong> is the primary reference
                platform verified in automated repository CI (85 Python QMP suites).{' '}
                <strong>Oracle VirtualBox</strong> and <strong>VMware Workstation</strong> are
                supported via standard UEFI GOP + SATA AHCI emulation and are marked as{' '}
                <span className="font-semibold text-amber-300">
                  Experimental / Community Hypervisor Targets
                </span>{' '}
                until formal multi-hypervisor sign-off. Attaching the ZonderqOS ISO alone is{' '}
                <strong>not</strong> sufficient for normal desktop startup: ZonderqOS requires an
                attached FAT32 partition labeled exactly{' '}
                <code className="font-mono font-bold text-amber-200">ZONDERQDATA</code>.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Recommended Initial VM Specifications + Limine Bootloader Architecture (#installation anchor) */}
        <div id="installation" className="scroll-mt-24 grid gap-6 lg:grid-cols-12">
          {/* Left 7 Cols: Recommended Initial VM Specifications Table */}
          <Card className="overflow-hidden p-0 lg:col-span-7">
            <div className="border-b border-slate-500/20 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Server className="h-5 w-5 text-[#3B82F6]" />
                  <h3 className="zq-text-primary text-lg font-extrabold">
                    Recommended Initial VM Specifications
                  </h3>
                </div>
                <Badge variant="default" className="font-mono text-xs">
                  Initial Testing Baseline
                </Badge>
              </div>
              <p className="zq-text-secondary mt-1 text-xs">
                Baseline configuration for testing ZonderqOS Alpha (
                {latestRelease?.tagName ?? 'v1.0.0-alfa'}) in desktop hypervisors.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700/70 bg-slate-900/80 font-mono text-slate-300">
                    <th className="px-4 py-3">Setting</th>
                    <th className="px-4 py-3">Recommended Value</th>
                    <th className="px-4 py-3">Technical Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {recommendedVmSpecsData.map((row) => (
                    <tr key={row.setting} className="transition hover:bg-slate-800/30">
                      <td className="zq-text-primary px-4 py-3 font-semibold">{row.setting}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#3B82F6]">{row.value}</td>
                      <td className="zq-text-secondary px-4 py-3 leading-relaxed">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Right 5 Cols: Limine v10 Dual-Slot A/B & ZONDERQDATA Storage Architecture */}
          <Card className="flex flex-col justify-between p-5 sm:p-6 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-purple-400">
                  <HardDrive className="h-5 w-5" />
                  <h3 className="zq-text-primary text-lg font-extrabold">
                    Bootloader & Storage Architecture
                  </h3>
                </div>
                <Badge variant="outline" className="font-mono text-[11px]">
                  Bootloader/limine.conf
                </Badge>
              </div>

              <p className="zq-text-secondary mt-2 text-xs leading-relaxed">
                ZonderqOS uses <strong>Limine v10</strong> with a dual-slot A/B configuration and
                fail-closed <code className="font-mono text-blue-300">DataVolumePolicy.cs</code>.
                During <code className="font-mono text-blue-300">Kernel.BeforeRun()</code>, the
                kernel scans attached storage controllers and mounts <strong>only</strong> a unique
                MBR (<code className="font-mono text-blue-300">0x0C</code> /{' '}
                <code className="font-mono text-blue-300">0x0B</code>) or GPT Basic Data FAT32
                partition labeled <code className="font-mono text-emerald-300">ZONDERQDATA</code>.
              </p>

              {/* 3 Limine Menu Entries */}
              <div className="mt-4 space-y-3">
                {limineBootEntriesData.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      'rounded-xl border p-3.5 text-xs',
                      entry.id === 'limine-recovery-iso'
                        ? 'border-emerald-500/40 bg-emerald-500/10'
                        : 'zq-surface-elevated',
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="font-mono font-bold text-white">{entry.menuEntry}</span>
                      <Badge
                        variant={entry.id === 'limine-recovery-iso' ? 'implemented' : 'outline'}
                        className="font-mono text-[10px]"
                      >
                        {entry.title}
                      </Badge>
                    </div>
                    <code className="mt-1 block break-all font-mono text-[11px] text-blue-300">
                      path: {entry.kernelPath}
                    </code>
                    <p className="zq-text-secondary mt-1.5 leading-relaxed">{entry.whenToUse}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-xs">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                <span className="zq-text-secondary">
                  <strong>Fresh VM Tip:</strong> On a brand-new VM where{' '}
                  <code className="font-mono text-blue-300">ZONDERQDATA</code> is newly formatted
                  and empty, always choose <strong>Entry 3 (/ZonderqOS Recovery ISO)</strong> in
                  Limine so the kernel loads from the ISO CD-ROM and mounts your{' '}
                  <code className="font-mono text-blue-300">ZONDERQDATA</code> disk at{' '}
                  <code className="font-mono text-blue-300">/</code>.
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* 2. Interactive Platform Selector Tabs (VirtualBox | VMware | QEMU/KVM | Physical USB) */}
        <div className="mt-14">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="zq-text-primary text-2xl font-extrabold">
                Platform-Specific Installation Guides
              </h3>
              <p className="zq-text-secondary mt-1 text-xs sm:text-sm">
                Select your target hypervisor or physical USB medium below for tested commands and
                controller settings.
              </p>
            </div>

            {/* Live ISO Quick Download Pill */}
            {detectedPackages.isoAsset && (
              <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-2">
                <Disc className="h-4 w-4 text-emerald-400" />
                <div className="font-mono text-xs">
                  <span className="text-slate-300">Active ISO:</span>{' '}
                  <strong className="text-emerald-300">{detectedPackages.isoAsset.name}</strong> (
                  {detectedPackages.isoAsset.sizeFormatted.mb})
                </div>
                <Button
                  href={detectedPackages.isoAsset.browserDownloadUrl}
                  variant="primary"
                  size="sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download ISO</span>
                </Button>
              </div>
            )}
          </div>

          {/* 4 Selectable Platform Tabs */}
          <div
            role="tablist"
            aria-label="Select installation platform"
            className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {platformGuidesData.map((platform) => {
              const Icon = getPlatformIcon(platform.id);
              const isSelected = selectedPlatform === platform.id;
              return (
                <button
                  key={platform.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={cn(
                    'flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] cursor-pointer',
                    isSelected
                      ? 'border-[#3B82F6] bg-gradient-to-br from-[#3B82F6]/20 via-[#8B5CF6]/15 to-transparent shadow-lg shadow-blue-500/10'
                      : 'zq-surface-card hover:border-blue-500/40',
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl border',
                        isSelected
                          ? 'border-blue-400/50 bg-blue-500/20 text-blue-300'
                          : 'border-slate-700 bg-slate-800/70 text-slate-300',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant={getVerificationBadgeVariant(platform.verificationLevel)}
                      className="font-mono text-[10px]"
                    >
                      {platform.id === 'qemu'
                        ? 'CI Verified'
                        : platform.id === 'physical-usb'
                          ? 'UEFI USB'
                          : 'Experimental'}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="zq-text-primary text-base font-extrabold">{platform.name}</div>
                    <div className="zq-text-muted mt-0.5 font-mono text-[11px]">
                      {platform.verificationLevel}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Platform Guide Content */}
          <motion.div
            key={activeGuide.id}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="border-blue-500/40 p-6 sm:p-8">
              {/* Platform Summary Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-slate-500/20 pb-6 lg:flex-row lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getVerificationBadgeVariant(activeGuide.verificationLevel)}>
                      {activeGuide.verificationLevel}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      x86_64 • UEFI GOP 1366×768×32 • FAT32 ZONDERQDATA
                    </Badge>
                  </div>
                  <h4 className="zq-text-primary mt-3 text-2xl font-extrabold sm:text-3xl">
                    {activeGuide.name} Installation Guide
                  </h4>
                  <p className="zq-text-secondary mt-2 max-w-3xl text-sm leading-relaxed">
                    {activeGuide.summary}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  {detectedPackages.isoAsset && (
                    <Button
                      href={detectedPackages.isoAsset.browserDownloadUrl}
                      variant="primary"
                      size="md"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download {detectedPackages.isoAsset.name}</span>
                    </Button>
                  )}
                  <Button
                    href={activeGuide.officialToolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="md"
                  >
                    <span>{activeGuide.officialToolLabel}</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Controller Recommendation & Limine First-Boot Notice */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="zq-surface-elevated rounded-xl p-4 text-xs leading-relaxed">
                  <div className="flex items-center gap-2 font-mono font-bold text-blue-300">
                    <Cpu className="h-4 w-4" />
                    <span>Storage & Controller Configuration</span>
                  </div>
                  <p className="zq-text-secondary mt-1.5">{activeGuide.controllerRecommendation}</p>
                </div>

                <div className="zq-surface-elevated rounded-xl border-emerald-500/30 p-4 text-xs leading-relaxed">
                  <div className="flex items-center gap-2 font-mono font-bold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Limine Menu Entry for First Boot</span>
                  </div>
                  <p className="zq-text-secondary mt-1.5">{activeGuide.freshBootLimineNotice}</p>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="mt-8 space-y-5">
                {activeGuide.steps.map((step) => {
                  const cmdBlock = step.commands ? step.commands.join('\n') : null;
                  const copyId = `${activeGuide.id}-step-${step.stepNumber}`;
                  return (
                    <div
                      key={step.stepNumber}
                      className="zq-surface-elevated rounded-2xl p-5 transition hover:border-blue-500/40"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-500/40 bg-blue-500/15 font-mono text-xs font-extrabold text-[#3B82F6]">
                          {step.stepNumber}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="zq-text-primary text-base font-bold">{step.title}</h5>
                          <p className="zq-text-secondary mt-1.5 text-xs leading-relaxed sm:text-sm">
                            {step.description}
                          </p>

                          {step.warning && (
                            <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
                              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                              <span>{step.warning}</span>
                            </div>
                          )}

                          {cmdBlock && (
                            <div className="mt-3.5 overflow-hidden rounded-xl border border-slate-800 bg-[#060911]">
                              <div className="flex items-center justify-between border-b border-slate-800/90 bg-slate-900/70 px-3.5 py-2">
                                <span className="font-mono text-[11px] text-slate-400">
                                  bash / shell
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(copyId, cmdBlock)}
                                  aria-label={`Copy commands for step ${step.stepNumber}`}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white cursor-pointer"
                                >
                                  {copiedKey === copyId ? (
                                    <>
                                      <Check className="h-3 w-3 text-emerald-400" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>Copy Commands</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-blue-300">
                                <code>{cmdBlock}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 3. Optional Preconfigured VM Packages & CI Packaging Architecture (Section 10) */}
        <Card className="mt-14 border-purple-500/35 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Package className="h-5 w-5 text-[#8B5CF6]" />
              <h3 className="zq-text-primary text-xl font-extrabold">
                Platform Artifacts & Preconfigured VM Package Status
              </h3>
            </div>
            <Badge variant="default" className="font-mono text-xs">
              Live GitHub Release Asset Detection
            </Badge>
          </div>
          <p className="zq-text-secondary mt-2 text-xs leading-relaxed sm:text-sm">
            The website automatically inspects the latest GitHub Release (
            <code className="font-mono text-blue-300">
              {latestRelease?.tagName ?? 'v1.0.0-alfa'}
            </code>
            ) for platform-specific packages. Download buttons are exposed <strong>only</strong>{' '}
            when the corresponding artifact is genuinely published in the GitHub Releases API —
            never as fake or broken links.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {/* 1. Official Bootable ISO */}
            <div className="zq-surface-elevated flex flex-col justify-between rounded-2xl p-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    {detectedPackages.isoAsset?.name ?? 'ZonderqOS-Alpha-ISO.iso'}
                  </span>
                  <Badge variant={detectedPackages.isoAsset ? 'implemented' : 'outline'}>
                    {detectedPackages.isoAsset ? 'Available Now' : 'Not Published'}
                  </Badge>
                </div>
                <p className="zq-text-secondary mt-2 text-xs">
                  Official hybrid UEFI/BIOS Limine bootable ISO image for QEMU/KVM, VirtualBox,
                  VMware, and physical USB drives.
                </p>
              </div>
              <div className="mt-4 pt-2">
                {detectedPackages.isoAsset ? (
                  <Button
                    href={detectedPackages.isoAsset.browserDownloadUrl}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>
                      Download {detectedPackages.isoAsset.name} (
                      {detectedPackages.isoAsset.sizeFormatted.mb})
                    </span>
                  </Button>
                ) : (
                  <span className="zq-text-muted block font-mono text-xs">
                    Awaiting release asset publication
                  </span>
                )}
              </div>
            </div>

            {/* 2. Preconfigured VirtualBox Package */}
            <div className="zq-surface-elevated flex flex-col justify-between rounded-2xl p-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    {detectedPackages.virtualBoxAsset?.name ?? 'ZonderqOS-Alpha-VirtualBox.zip'}
                  </span>
                  <Badge variant={detectedPackages.virtualBoxAsset ? 'implemented' : 'outline'}>
                    {detectedPackages.virtualBoxAsset ? 'Available Now' : 'Manual VDI Conversion'}
                  </Badge>
                </div>
                <p className="zq-text-secondary mt-2 text-xs">
                  Optional pre-formatted VirtualBox VDI bundle with seeded{' '}
                  <code className="font-mono text-blue-300">ZONDERQDATA</code> partition.
                </p>
              </div>
              <div className="mt-4 pt-2">
                {detectedPackages.virtualBoxAsset ? (
                  <Button
                    href={detectedPackages.virtualBoxAsset.browserDownloadUrl}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download VirtualBox Bundle</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setSelectedPlatform('virtualbox')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <span>Use VBoxManage Guide Above</span>
                  </Button>
                )}
              </div>
            </div>

            {/* 3. Preconfigured VMware Package */}
            <div className="zq-surface-elevated flex flex-col justify-between rounded-2xl p-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    {detectedPackages.vmwareAsset?.name ?? 'ZonderqOS-Alpha-VMware.zip'}
                  </span>
                  <Badge variant={detectedPackages.vmwareAsset ? 'implemented' : 'outline'}>
                    {detectedPackages.vmwareAsset ? 'Available Now' : 'Manual VMDK Conversion'}
                  </Badge>
                </div>
                <p className="zq-text-secondary mt-2 text-xs">
                  Optional pre-formatted VMware VMDK bundle with seeded{' '}
                  <code className="font-mono text-blue-300">ZONDERQDATA</code> partition.
                </p>
              </div>
              <div className="mt-4 pt-2">
                {detectedPackages.vmwareAsset ? (
                  <Button
                    href={detectedPackages.vmwareAsset.browserDownloadUrl}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download VMware Bundle</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setSelectedPlatform('vmware')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <span>Use qemu-img VMDK Guide Above</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 4. Comprehensive Troubleshooting Guide (Section 11) */}
        <div className="mt-14">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="zq-text-primary flex items-center gap-2 text-2xl font-extrabold">
                <Wrench className="h-6 w-6 text-[#3B82F6]" />
                <span>Boot, Storage & Hypervisor Troubleshooting</span>
              </h3>
              <p className="zq-text-secondary mt-1 text-xs sm:text-sm">
                Solutions for common UEFI, Limine slot A/B, ZONDERQDATA volume, framebuffer, and
                input errors.
              </p>
            </div>

            <Button
              href="https://github.com/dwierzbicki11/ZOnderqOS/issues"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
            >
              <Bug className="h-4 w-4 text-rose-400" />
              <span>Report Installation Issue on GitHub</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {vmTroubleshootingData.map((item) => (
              <Card key={item.id} className="flex flex-col justify-between p-5">
                <div>
                  <h4 className="zq-text-primary text-sm font-extrabold text-amber-300">
                    {item.symptom}
                  </h4>
                  <p className="zq-text-muted mt-2 text-xs">
                    <strong className="zq-text-primary">Root Cause:</strong> {item.cause}
                  </p>
                  <p className="zq-text-secondary mt-2 text-xs leading-relaxed">
                    <strong className="text-emerald-300">Solution:</strong> {item.solution}
                  </p>
                </div>

                {item.commandHint && (
                  <div className="mt-3 rounded-lg border border-slate-800 bg-[#060911] px-3 py-2 font-mono text-[11px] text-blue-300">
                    <code>{item.commandHint}</code>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
