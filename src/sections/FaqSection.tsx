import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { faqData } from '@/data/faq';
import { uiText } from '@/data/i18n';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

export function FaqSection(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(faqData[0]?.id ?? null);

  return (
    <section id="faq" className="py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={uiText.faq.eyebrow}
          title={uiText.faq.title}
          subtitle={uiText.faq.subtitle}
        />

        <div className="space-y-4">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <Card
                key={item.id}
                className={cn(
                  'overflow-hidden p-0 transition-colors',
                  isOpen && 'border-blue-500/50',
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3B82F6] sm:p-6 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#3B82F6]" />
                    <div>
                      <Badge variant="outline" className="mb-1.5 font-mono text-[10px]">
                        {item.category}
                      </Badge>
                      <h3 className="zq-text-primary text-base font-bold sm:text-lg">
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      'zq-text-muted h-5 w-5 shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 text-[#3B82F6]',
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${item.id}`}
                      initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-500/15"
                    >
                      <p className="zq-text-secondary px-5 py-4 text-sm leading-relaxed sm:px-6 sm:py-5">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
