import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Cpu,
  FileImage,
  Info,
  Layers,
  Maximize2,
  Monitor,
  Terminal,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Lightbox } from '@/components/ui/Lightbox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { uiText } from '@/data/i18n';
import { generationComparisonData, screenshotsData } from '@/data/screenshots';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import type { ScreenshotCategory } from '@/types/site';

const CATEGORIES: Array<'ALL' | ScreenshotCategory> = [
  'ALL',
  'Desktop',
  'System Applications',
  'Settings',
  'Diagnostics',
  'Boot & Installation',
  'Hardware Testing',
];

export function ScreenshotsSection(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ScreenshotCategory>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    selectedCategory === 'ALL'
      ? screenshotsData
      : screenshotsData.filter((item) => item.category === selectedCategory);

  return (
    <section id="screenshots" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={uiText.screenshots.eyebrow}
          title={uiText.screenshots.title}
          subtitle={uiText.screenshots.subtitle}
        />

        {/* Visual Authenticity Banner */}
        <div className="mx-auto mb-10 max-w-4xl rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-amber-300">
                {uiText.screenshots.authenticityNoticeTitle}
              </h3>
              <p className="zq-text-secondary mt-1 text-xs leading-relaxed sm:text-sm">
                {uiText.screenshots.authenticityNoticeBody}
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div
          role="tablist"
          aria-label="Filter gallery by category"
          className="mb-10 flex flex-wrap items-center justify-center gap-2"
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedCategory(category);
                  setLightboxIndex(null);
                }}
                className={cn(
                  'rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] cursor-pointer',
                  isSelected
                    ? 'border-[#3B82F6] bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 zq-text-primary'
                    : 'zq-surface-card zq-text-secondary hover:border-blue-500/40',
                )}
              >
                {category === 'ALL'
                  ? uiText.screenshots.filterAll
                  : uiText.screenshots.categories[category]}
              </button>
            );
          })}
        </div>

        {/* Gallery Thumbnail Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout={!reducedMotion}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.2) }}
              className="flex"
            >
              <Card className="group flex w-full flex-col justify-between overflow-hidden p-0 hover:border-blue-500/50">
                {/* Preview Surface */}
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`${uiText.screenshots.openLightboxLabel}: ${item.title}`}
                  className="relative block aspect-video w-full overflow-hidden bg-[#070A12] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3B82F6] cursor-pointer"
                >
                  {!item.isPlaceholder && item.src ? (
                    <picture>
                      {item.avifSrc && <source srcSet={item.avifSrc} type="image/avif" />}
                      {item.webpSrc && <source srcSet={item.webpSrc} type="image/webp" />}
                      <img
                        src={item.src}
                        alt={item.title}
                        loading="lazy"
                        width={640}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </picture>
                  ) : (
                    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#0F172A] via-[#090D18] to-[#172036] p-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] text-blue-300">
                          <Monitor className="h-3 w-3" />
                          {item.resolution}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {item.generation}
                        </span>
                      </div>

                      <div className="my-auto py-2">
                        <div className="font-mono text-[11px] font-semibold text-amber-300">
                          [{uiText.screenshots.placeholderBadge}]
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs font-medium text-slate-200">
                          {item.title}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 truncate rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                        <FileImage className="h-3 w-3 shrink-0 text-blue-400" />
                        <span className="truncate">{item.expectedReplacementPath}</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Lightbox Trigger Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-white shadow-lg">
                      <Maximize2 className="h-3.5 w-3.5 text-[#3B82F6]" />
                      {uiText.screenshots.openLightboxLabel}
                    </span>
                  </div>
                </button>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant={item.isPlaceholder ? 'experimental' : 'implemented'}>
                        {item.isPlaceholder ? (
                          uiText.screenshots.placeholderBadge
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            {uiText.screenshots.authenticBadge}
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-[11px]">
                        {item.category}
                      </Badge>
                    </div>

                    <h3 className="zq-text-primary mt-3 text-base font-bold">{item.title}</h3>
                    <p className="zq-text-secondary mt-1.5 text-xs leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-500/15 pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {item.highlights.map((hl) => (
                        <span
                          key={hl}
                          className="zq-surface-elevated zq-text-secondary inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px]"
                        >
                          <Terminal className="h-2.5 w-2.5 text-[#3B82F6]" />
                          {hl}
                        </span>
                      ))}
                    </div>
                    <div className="zq-text-muted mt-2.5 flex items-center justify-between font-mono text-[11px]">
                      <span>{item.version}</span>
                      <span>{item.framebufferFormat}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Generation Visual & Pipeline Comparison (Gen1 vs Gen2 vs Gen3) */}
        <div className="mt-16">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h3 className="zq-text-primary text-2xl font-bold sm:text-3xl">
              {uiText.screenshots.generationSectionTitle}
            </h3>
            <p className="zq-text-secondary mt-2 text-sm sm:text-base">
              {uiText.screenshots.generationSectionSubtitle}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {generationComparisonData.map((gen) => (
              <Card
                key={gen.generation}
                className={cn(
                  'flex flex-col justify-between',
                  gen.generation === 'Gen3' && 'border-blue-500/50 shadow-lg shadow-blue-500/10',
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant={gen.generation === 'Gen3' ? 'implemented' : 'outline'}
                      className="font-mono text-xs"
                    >
                      {gen.generation} • {gen.period}
                    </Badge>
                    <Layers className="h-4 w-4 text-[#3B82F6]" />
                  </div>

                  <h4 className="zq-text-primary mt-3 text-lg font-bold">{gen.codename}</h4>

                  <dl className="mt-4 space-y-2.5 text-xs">
                    <div className="zq-surface-elevated rounded-xl p-2.5">
                      <dt className="zq-text-muted font-mono text-[10px] uppercase">
                        Compiler & Runtime
                      </dt>
                      <dd className="zq-text-primary mt-0.5 font-medium">
                        {gen.compilerAndRuntime}
                      </dd>
                    </div>
                    <div className="zq-surface-elevated rounded-xl p-2.5">
                      <dt className="zq-text-muted font-mono text-[10px] uppercase">
                        Boot & Display Pipeline
                      </dt>
                      <dd className="zq-text-primary mt-0.5 font-medium">{gen.bootAndDisplay}</dd>
                    </div>
                    <div className="zq-surface-elevated rounded-xl p-2.5">
                      <dt className="zq-text-muted font-mono text-[10px] uppercase">
                        Memory & Scheduler
                      </dt>
                      <dd className="zq-text-primary mt-0.5 font-medium">{gen.memoryAndGc}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 border-t border-slate-500/15 pt-3 text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#3B82F6]">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>{gen.architecture}</span>
                  </div>
                  <p className="zq-text-secondary mt-1.5 leading-relaxed">{gen.visualNotes}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        items={filteredItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextIndex) => setLightboxIndex(nextIndex)}
      />
    </section>
  );
}
