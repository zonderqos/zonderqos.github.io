import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileCode2,
  Filter,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { uiText } from '@/data/i18n';
import { roadmapData } from '@/data/roadmap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { calculateStageProgress, cn, roadmapStatusToBadgeVariant } from '@/lib/utils';
import type { RoadmapCategory, RoadmapStatus } from '@/types/site';

const ROADMAP_CATEGORIES: Array<'ALL' | RoadmapCategory> = [
  'ALL',
  'Kernel & Arch',
  'GUI & Apps',
  'Storage & Update',
  'Hardware & Drivers',
  'Networking & Audio',
];

function StatusIcon({ status }: { status: RoadmapStatus }): React.ReactElement {
  switch (status) {
    case 'Completed':
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case 'Testing':
      return <Sparkles className="h-4 w-4 text-cyan-400" />;
    case 'In Progress':
      return <Clock className="h-4 w-4 text-blue-400" />;
    case 'Blocked':
      return <Lock className="h-4 w-4 text-rose-400" />;
    case 'Planned':
      return <Clock className="h-4 w-4 text-purple-400" />;
  }
}

export function RoadmapSection(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | RoadmapCategory>('ALL');
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    'stage-alpha': true,
    'stage-beta': true,
    'stage-rc': false,
    'stage-v1': false,
    'stage-future': false,
  });

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  return (
    <section id="roadmap" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={uiText.roadmap.eyebrow}
          title={uiText.roadmap.title}
          subtitle={uiText.roadmap.subtitle}
        />

        {/* High-Level Milestone Overview Strip */}
        <div className="mx-auto mb-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roadmapData.slice(0, 4).map((stage) => (
            <div
              key={stage.id}
              className={cn(
                'rounded-2xl border p-4',
                stage.status === 'Completed'
                  ? 'border-emerald-500/45 bg-emerald-500/10'
                  : stage.status === 'In Progress'
                    ? 'border-blue-500/45 bg-blue-500/10'
                    : 'zq-surface-card',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold uppercase text-slate-400">
                  Phase 0{stage.stageNumber}
                </span>
                <StatusIcon status={stage.status} />
              </div>
              <div className="zq-text-primary mt-1.5 text-sm font-extrabold">
                {stage.phaseLabel}
              </div>
            </div>
          ))}
        </div>

        {/* Audit Notice */}
        <div className="mx-auto mb-8 flex max-w-4xl items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-xs sm:text-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
          <span className="zq-text-secondary">{uiText.roadmap.auditNotice}</span>
        </div>

        {/* Category Filter Pills */}
        <div
          role="tablist"
          aria-label="Filter roadmap tasks by subsystem category"
          className="mb-12 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="zq-text-muted mr-1 inline-flex items-center gap-1 text-xs font-medium">
            <Filter className="h-3.5 w-3.5 text-[#3B82F6]" />
          </span>
          {ROADMAP_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] cursor-pointer',
                  isSelected
                    ? 'border-[#3B82F6] bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 zq-text-primary'
                    : 'zq-surface-card zq-text-secondary hover:border-blue-500/40',
                )}
              >
                {category === 'ALL'
                  ? uiText.roadmap.filterAllCategories
                  : uiText.roadmap.categories[category]}
              </button>
            );
          })}
        </div>

        {/* Vertical Animated Timeline */}
        <div className="relative mx-auto max-w-5xl">
          {/* Timeline Spine */}
          <div
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-4 w-0.5 bg-gradient-to-b from-emerald-400 via-[#3B82F6] to-slate-800 sm:left-7"
          />

          <div className="space-y-8">
            {roadmapData.map((stage, stageIdx) => {
              const stageProgress = calculateStageProgress(stage.tasks);
              const visibleTasks =
                selectedCategory === 'ALL'
                  ? stage.tasks
                  : stage.tasks.filter((task) => task.category === selectedCategory);
              const isExpanded = Boolean(expandedStages[stage.id]);

              return (
                <motion.div
                  key={stage.id}
                  initial={reducedMotion ? false : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: Math.min(stageIdx * 0.06, 0.24) }}
                  className="relative pl-12 sm:pl-20"
                >
                  {/* Timeline Node Circle */}
                  <div
                    className={cn(
                      'absolute top-6 left-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs font-bold shadow-md sm:left-3 sm:h-9 sm:w-9',
                      stage.status === 'Completed'
                        ? 'border-emerald-400 bg-[#080B14] text-emerald-300 shadow-emerald-500/20'
                        : stage.status === 'In Progress'
                          ? 'border-[#3B82F6] bg-[#080B14] text-[#3B82F6] shadow-blue-500/20'
                          : 'border-purple-500/60 bg-[#080B14] text-purple-300',
                    )}
                  >
                    {stage.stageNumber}
                  </div>

                  <Card
                    className={cn(
                      'overflow-hidden p-0 transition-all',
                      stage.stageNumber === 1 && 'border-emerald-500/45',
                      stage.stageNumber === 2 && 'border-blue-500/45',
                    )}
                  >
                    {/* Stage Header */}
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={roadmapStatusToBadgeVariant(stage.status)}>
                            <StatusIcon status={stage.status} />
                            <span>{stage.phaseLabel}</span>
                          </Badge>
                          <span className="zq-text-muted inline-flex items-center gap-1.5 font-mono text-xs">
                            <Calendar className="h-3.5 w-3.5 text-[#3B82F6]" />
                            {stage.confirmedTargetDate ? (
                              <span className="font-semibold text-emerald-400">
                                {uiText.roadmap.targetDateConfirmedLabel}:{' '}
                                {stage.confirmedTargetDate}
                              </span>
                            ) : (
                              <span>{uiText.roadmap.targetDateUnconfirmed}</span>
                            )}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleStage(stage.id)}
                          aria-expanded={isExpanded}
                          aria-controls={`roadmap-tasks-${stage.id}`}
                          className="zq-surface-elevated zq-text-secondary hover:zq-text-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:border-blue-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] cursor-pointer"
                        >
                          <span>
                            {isExpanded ? uiText.roadmap.collapseStage : uiText.roadmap.expandStage}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <h3 className="zq-text-primary mt-3 text-xl font-extrabold sm:text-2xl">
                        {stage.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs font-medium text-[#3B82F6] sm:text-sm">
                        {stage.subtitle}
                      </p>
                      <p className="zq-text-secondary mt-2.5 text-sm leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Verified Progress Bar (Calculated strictly from defined stage tasks) */}
                      {stageProgress.percentage !== null && (
                        <div className="mt-5 rounded-xl border border-slate-500/20 bg-slate-900/40 p-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="zq-text-secondary font-medium">
                              {uiText.roadmap.verifiedProgressLabel}
                            </span>
                            <span
                              className={cn(
                                'font-mono font-semibold',
                                stageProgress.percentage === 100
                                  ? 'text-emerald-400'
                                  : 'text-[#3B82F6]',
                              )}
                            >
                              {stageProgress.completed} / {stageProgress.total}{' '}
                              {uiText.roadmap.tasksCompletedLabel} ({stageProgress.percentage}%)
                            </span>
                          </div>
                          <div
                            role="progressbar"
                            aria-label={`${stage.name} progress`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={stageProgress.percentage}
                            className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800"
                          >
                            <motion.div
                              initial={reducedMotion ? false : { width: 0 }}
                              whileInView={{ width: `${stageProgress.percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className={cn(
                                'h-full rounded-full',
                                stageProgress.percentage === 100
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                  : 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]',
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expandable Tasks List */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={`roadmap-tasks-${stage.id}`}
                          initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden border-t border-slate-500/20 bg-slate-950/30"
                        >
                          <div className="space-y-3 p-5 sm:p-6">
                            {visibleTasks.length === 0 ? (
                              <p className="zq-text-muted py-2 text-center font-mono text-xs">
                                No tasks in this milestone match the selected category filter (
                                {selectedCategory}).
                              </p>
                            ) : (
                              visibleTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="zq-surface-elevated rounded-xl p-4 transition hover:border-blue-500/40"
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div className="flex items-start gap-2.5">
                                      <div className="mt-0.5 shrink-0">
                                        <StatusIcon status={task.status} />
                                      </div>
                                      <div>
                                        <h4 className="zq-text-primary text-sm font-bold">
                                          {task.title}
                                        </h4>
                                        <p className="zq-text-secondary mt-1 text-xs leading-relaxed">
                                          {task.detail}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                                      <Badge variant="outline" className="font-mono text-[10px]">
                                        {task.category}
                                      </Badge>
                                      <Badge
                                        variant={roadmapStatusToBadgeVariant(task.status)}
                                        className="text-[11px]"
                                      >
                                        {uiText.roadmap.statuses[task.status]}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="zq-text-muted mt-3 flex items-center gap-1.5 border-t border-slate-500/15 pt-2 font-mono text-[11px]">
                                    <FileCode2 className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                                    <span>
                                      {uiText.roadmap.verifiedSourceLabel}: {task.verifiedSource}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
