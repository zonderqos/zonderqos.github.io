import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AppWindow,
  CheckCircle2,
  Cpu,
  HardDrive,
  Keyboard,
  Layers,
  MemoryStick,
  Monitor,
  RefreshCw,
  ShieldAlert,
  Wifi,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { featuresData } from '@/data/features';
import { uiText } from '@/data/i18n';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn, featureStatusToBadgeVariant } from '@/lib/utils';
import type { FeatureItem, FeatureStatus } from '@/types/site';

const ICON_MAP: Record<FeatureItem['iconName'], React.ComponentType<{ className?: string }>> = {
  Monitor,
  Cpu,
  HardDrive,
  Keyboard,
  AppWindow,
  MemoryStick,
  RefreshCw,
  Activity,
  Wifi,
  Layers,
};

const STATUS_FILTERS: Array<'ALL' | FeatureStatus> = [
  'ALL',
  'Implemented',
  'Experimental',
  'In Development',
  'Planned',
];

export function FeaturesSection(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | FeatureStatus>('ALL');

  const filteredFeatures =
    selectedStatus === 'ALL'
      ? featuresData
      : featuresData.filter((item) => item.status === selectedStatus);

  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={uiText.features.eyebrow}
          title={uiText.features.title}
          subtitle={uiText.features.subtitle}
        />

        {/* Verification Policy Banner */}
        <div className="mx-auto mb-8 flex max-w-3xl items-center justify-center gap-2.5 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-center text-xs sm:text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0 text-[#3B82F6]" />
          <span className="zq-text-secondary">{uiText.features.verificationBanner}</span>
        </div>

        {/* Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter features by implementation status"
          className="mb-10 flex flex-wrap items-center justify-center gap-2"
        >
          {STATUS_FILTERS.map((status) => {
            const isSelected = selectedStatus === status;
            const count =
              status === 'ALL'
                ? featuresData.length
                : featuresData.filter((f) => f.status === status).length;

            return (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedStatus(status)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] cursor-pointer',
                  isSelected
                    ? 'border-[#3B82F6] bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 zq-text-primary shadow-sm'
                    : 'zq-surface-card zq-text-secondary hover:border-blue-500/40',
                )}
              >
                <span>
                  {status === 'ALL'
                    ? uiText.features.filterAll
                    : uiText.features.statusLabels[status]}
                </span>
                <span className="rounded-full bg-slate-500/20 px-2 py-0.5 font-mono text-[11px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature, index) => {
            const IconComponent = ICON_MAP[feature.iconName];
            return (
              <motion.div
                key={feature.id}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.25) }}
                whileHover={reducedMotion ? undefined : { y: -4 }}
                className="flex"
              >
                <Card className="group flex w-full flex-col justify-between hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
                  <div>
                    {/* Top Row: Icon + Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 text-[#3B82F6] transition-transform duration-300 group-hover:scale-105">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <Badge variant={featureStatusToBadgeVariant(feature.status)}>
                        {uiText.features.statusLabels[feature.status]}
                      </Badge>
                    </div>

                    {/* Title & Description */}
                    <h3 className="zq-text-primary mt-5 text-lg font-bold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="zq-text-secondary mt-2 text-sm leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Technical Details List */}
                    <ul className="mt-4 space-y-2 border-t border-slate-500/15 pt-4 text-xs">
                      {feature.technicalDetails.map((detail, idx) => (
                        <li key={idx} className="zq-text-secondary flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Metadata */}
                  <div className="mt-5 border-t border-slate-500/15 pt-3 font-mono text-[11px]">
                    <div className="zq-text-muted truncate" title={feature.sourceModule}>
                      <span className="font-semibold text-[#3B82F6]">
                        {uiText.features.sourceModuleLabel}:
                      </span>{' '}
                      {feature.sourceModule}
                    </div>
                    <div className="zq-text-muted mt-1">
                      <span className="font-semibold text-[#8B5CF6]">
                        {uiText.features.architectureLabel}:
                      </span>{' '}
                      {feature.architecture}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
