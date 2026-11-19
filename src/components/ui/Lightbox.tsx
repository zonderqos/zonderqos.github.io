import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileImage,
  Layers,
  Monitor,
  Terminal,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { uiText } from '@/data/i18n';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ScreenshotItem } from '@/types/site';

interface LightboxProps {
  items: ScreenshotItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function Lightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: LightboxProps): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [zoom, setZoom] = useState<number>(1);

  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < items.length;
  const currentItem = isOpen ? items[activeIndex] : null;

  useEffect(() => {
    if (!isOpen || activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setZoom(1);
        onNavigate((activeIndex - 1 + items.length) % items.length);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setZoom(1);
        onNavigate((activeIndex + 1) % items.length);
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setZoom((z) => Math.min(2, Number((z + 0.25).toFixed(2))));
      } else if (event.key === '-') {
        event.preventDefault();
        setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIndex, items.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && currentItem && activeIndex !== null && (
        <motion.div
          key="zonderq-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={currentItem.title}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={reducedMotion ? false : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0B101E] text-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={currentItem.isPlaceholder ? 'experimental' : 'implemented'}>
                  {currentItem.isPlaceholder
                    ? uiText.screenshots.placeholderBadge
                    : uiText.screenshots.authenticBadge}
                </Badge>
                <Badge variant="default">{currentItem.category}</Badge>
                <Badge variant="outline" className="font-mono">
                  {currentItem.generation} • {currentItem.version}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
                  disabled={zoom <= 1}
                  aria-label={uiText.screenshots.lightbox.zoomOut}
                  className="rounded-lg border border-slate-700/70 bg-slate-800/70 p-2 text-slate-200 transition hover:border-blue-500/60 hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="min-w-[3.2rem] text-center font-mono text-xs text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2, Number((z + 0.25).toFixed(2))))}
                  disabled={zoom >= 2}
                  aria-label={uiText.screenshots.lightbox.zoomIn}
                  className="rounded-lg border border-slate-700/70 bg-slate-800/70 p-2 text-slate-200 transition hover:border-blue-500/60 hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={uiText.screenshots.lightbox.close}
                  className="ml-2 rounded-lg border border-slate-700/70 bg-slate-800/70 p-2 text-slate-200 transition hover:border-rose-500/60 hover:bg-rose-500/20 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Viewport */}
            <div className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-auto bg-[#060911] p-4 sm:min-h-[420px] sm:p-8">
              {!currentItem.isPlaceholder && currentItem.src ? (
                <div
                  className="transition-transform duration-200 ease-out"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <picture>
                    {currentItem.avifSrc && (
                      <source srcSet={currentItem.avifSrc} type="image/avif" />
                    )}
                    {currentItem.webpSrc && (
                      <source srcSet={currentItem.webpSrc} type="image/webp" />
                    )}
                    <img
                      src={currentItem.src}
                      alt={currentItem.title}
                      className="max-h-[56vh] w-auto rounded-xl border border-slate-700/60 object-contain shadow-2xl"
                    />
                  </picture>
                </div>
              ) : (
                <div
                  className="w-full max-w-2xl rounded-2xl border border-dashed border-blue-500/40 bg-gradient-to-br from-[#111827] via-[#0B111E] to-[#131B2E] p-6 transition-transform duration-200 sm:p-8"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Monitor className="h-5 w-5" />
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                        {uiText.screenshots.placeholderBadge}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      {currentItem.resolution}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white sm:text-xl">{currentItem.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {currentItem.caption}
                  </p>

                  <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <FileImage className="h-3.5 w-3.5 text-blue-400" />
                        <span>{uiText.screenshots.lightbox.replacementPath}</span>
                      </div>
                      <code className="mt-1 block break-all font-mono text-xs text-blue-300">
                        {currentItem.expectedReplacementPath}
                      </code>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Cpu className="h-3.5 w-3.5 text-purple-400" />
                        <span>{uiText.screenshots.lightbox.framebuffer}</span>
                      </div>
                      <code className="mt-1 block font-mono text-xs text-purple-300">
                        {currentItem.framebufferFormat}
                      </code>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentItem.highlights.map((hl) => (
                      <span
                        key={hl}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-800/80 px-2.5 py-1 font-mono text-xs text-slate-200"
                      >
                        <Terminal className="h-3 w-3 text-blue-400" />
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Arrows */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      onNavigate((activeIndex - 1 + items.length) % items.length);
                    }}
                    aria-label={uiText.screenshots.lightbox.previous}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-700/80 bg-slate-900/85 p-2.5 text-slate-100 shadow-lg transition hover:border-blue-500 hover:bg-blue-600/20 cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      onNavigate((activeIndex + 1) % items.length);
                    }}
                    aria-label={uiText.screenshots.lightbox.next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-700/80 bg-slate-900/85 p-2.5 text-slate-100 shadow-lg transition hover:border-blue-500 hover:bg-blue-600/20 cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Footer Metadata */}
            <div className="border-t border-slate-800 bg-[#0D1324] px-4 py-3.5 sm:px-6">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h4 className="font-semibold text-white">{currentItem.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-300">{currentItem.caption}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-blue-400" />
                    {activeIndex + 1} / {items.length}
                  </span>
                  <span className="hidden md:inline">
                    {uiText.screenshots.lightbox.keyboardHint}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
