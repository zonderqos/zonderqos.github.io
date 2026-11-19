import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Cpu,
  Download,
  ExternalLink,
  HardDrive,
  Layers,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { ZonderqLogo } from '@/assets/ZonderqLogo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { uiText } from '@/data/i18n';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function HeroSection(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [spotlight, setSpotlight] = useState<{ x: number; y: number }>({ x: 50, y: 35 });

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y });
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28"
    >
      {/* Subtle Cursor-Reactive Spotlight & Animated Gradient Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
        style={{
          background: `radial-gradient(650px circle at ${spotlight.x}% ${spotlight.y}%, rgba(59, 130, 246, 0.13), rgba(139, 92, 246, 0.06) 45%, transparent 80%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[460px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#3B82F6]/15 via-[#8B5CF6]/12 to-transparent blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Status Pills */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex flex-wrap items-center justify-center gap-2"
          >
            <Badge variant="completed" className="px-3.5 py-1 font-mono text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{uiText.hero.milestonePill}</span>
            </Badge>
            <Badge variant="outline" className="px-3 py-1 font-mono text-xs">
              {uiText.hero.kernelBadge}
            </Badge>
          </motion.div>

          {/* Logo + Main Heading */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-6 flex flex-col items-center justify-center"
          >
            <ZonderqLogo className="mb-4 h-14 w-14 shadow-xl shadow-blue-500/20" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="zq-text-primary">Zonderq</span>
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                OS
              </span>
              <span className="zq-text-primary"> — Alpha Milestone Completed</span>
            </h1>
          </motion.div>

          {/* Required Subtitle */}
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-4 bg-gradient-to-r from-blue-300 via-slate-100 to-purple-300 bg-clip-text text-lg font-semibold text-transparent sm:text-2xl"
          >
            {uiText.hero.subtitle}
          </motion.p>

          {/* Project Description */}
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="zq-text-secondary mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg"
          >
            {uiText.hero.description}
          </motion.p>

          {/* Elegant Alpha Completed Milestone Badge Card */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28 }}
            className="mx-auto mt-7 max-w-2xl rounded-2xl border border-emerald-500/35 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 p-4 text-left shadow-lg shadow-emerald-950/20"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-emerald-300">
                      {uiText.hero.alphaCompletedCardTitle}
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                      100% DONE
                    </span>
                  </div>
                  <p className="zq-text-secondary mt-0.5 text-xs">
                    {uiText.hero.alphaCompletedCardDetail}
                  </p>
                </div>
              </div>
              <div className="shrink-0 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 font-mono text-xs">
                <div className="text-[10px] uppercase text-slate-400">
                  {uiText.hero.nextPhaseLabel}
                </div>
                <div className="font-bold text-blue-300">{uiText.hero.nextPhaseValue}</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <Button href="#features" variant="primary" size="lg">
              <span>{uiText.hero.ctaFeatures}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="https://github.com/dwierzbicki11/ZOnderqOS"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
            >
              <span>{uiText.hero.ctaGithub}</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button href="#downloads" variant="outline" size="lg">
              <Download className="h-4 w-4" />
              <span>{uiText.hero.ctaDownload}</span>
            </Button>
          </motion.div>
        </div>

        {/* Hero System Preview Card (Opacity + Scale entrance) */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4, ease: 'easeOut' }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0D1322] shadow-2xl shadow-blue-950/30">
            {/* Window Title Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-[#090D18] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs font-medium text-slate-300">
                  {uiText.hero.previewTitle}
                </span>
              </div>
              <Badge variant="implemented" className="font-mono text-[11px]">
                <CheckCircle2 className="h-3 w-3" />
                {uiText.hero.previewAuthenticityBadge}
              </Badge>
            </div>

            {/* Authentic Wallpaper + Kernel Framebuffer Telemetry Overlay */}
            <div className="relative grid lg:grid-cols-12">
              {/* Left 7 Cols: Authentic Repository Wallpaper Preview */}
              <div className="relative min-h-[260px] overflow-hidden border-b border-slate-800 lg:col-span-7 lg:border-r lg:border-b-0">
                <picture>
                  <source srcSet="/assets/zonderqos/wallpaper.webp" type="image/webp" />
                  <img
                    src="/assets/zonderqos/wallpaper.png"
                    alt="Authentic ZonderqOS Gen3 Desktop Wallpaper Asset (source/Wallpapers/wallpaper.png)"
                    width={1920}
                    height={1080}
                    className="h-full w-full object-cover"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="rounded-2xl border border-white/15 bg-[#080B14]/85 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-blue-400">
                        source/Wallpapers/wallpaper.png (1920×1080 RGB)
                      </span>
                      <span className="rounded-md bg-blue-500/20 px-2 py-0.5 font-mono text-[11px] text-blue-300">
                        GOP 32-bit
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                      {uiText.hero.previewNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Live Verified Kernel 3.0.97 Specifications */}
              <div className="flex flex-col justify-between bg-[#0B101D] p-5 sm:p-6 lg:col-span-5">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-purple-400">
                    <Terminal className="h-4 w-4" />
                    <span>KernelBuildInfo.cs • Build 3120 (Alpha Completed)</span>
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-white">
                    {uiText.hero.previewSubtitle}
                  </h2>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="rounded-xl border border-slate-800/90 bg-slate-900/70 p-3">
                      <div className="flex items-center gap-2 font-semibold text-slate-200">
                        <Cpu className="h-3.5 w-3.5 text-blue-400" />
                        <span>Cosmos.Sdk 3.0.97 • .NET 10.0 NativeAOT</span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-slate-400">
                        ZonderqOS.elf • Single-CPU Stride Scheduler • OrionGC
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-slate-900/70 p-3">
                      <div className="flex items-center gap-2 font-semibold text-slate-200">
                        <Layers className="h-3.5 w-3.5 text-purple-400" />
                        <span>Zero-Allocation CursorDamageRenderer</span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-slate-400">
                        24×28 (672 px) preallocated buffer • 105 GUI cycles (+0.19 MB)
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-slate-900/70 p-3">
                      <div className="flex items-center gap-2 font-semibold text-slate-200">
                        <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Fail-Closed DataVolumePolicy (FAT32)</span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-slate-400">
                        Mounts ZONDERQDATA only • Rejects host EFI/ESP • 64 MiB RAM disk
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-slate-900/70 p-3">
                      <div className="flex items-center gap-2 font-semibold text-slate-200">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                        <span>Slot A/B BootGuard & Ed25519 Verifier</span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-slate-400">
                        UPDATE_FORMAT=2 • B→B→B→A GNU-EFI rollback (Beta OVMF track)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verified Metrics Strip */}
                <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-slate-800 pt-4">
                  <div className="rounded-lg bg-slate-900/90 px-3 py-2">
                    <div className="font-mono text-base font-bold text-blue-400">38 / 44</div>
                    <div className="text-[11px] text-slate-400">
                      {uiText.hero.metrics.appsLabel}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-900/90 px-3 py-2">
                    <div className="font-mono text-base font-bold text-purple-400">91</div>
                    <div className="text-[11px] text-slate-400">
                      {uiText.hero.metrics.commandsLabel}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-900/90 px-3 py-2">
                    <div className="font-mono text-base font-bold text-emerald-400">85 + 23</div>
                    <div className="text-[11px] text-slate-400">
                      {uiText.hero.metrics.testsLabel}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-900/90 px-3 py-2">
                    <div className="font-mono text-base font-bold text-emerald-400">100%</div>
                    <div className="text-[11px] text-slate-400">
                      {uiText.hero.metrics.alphaCompletionLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
