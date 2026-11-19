import React from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/Badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  id?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  id,
}: SectionHeaderProps): React.ReactElement {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mx-auto mb-12 max-w-3xl text-center"
    >
      <Badge variant="default" className="mb-4 px-3 py-1 font-mono text-xs">
        {eyebrow}
      </Badge>
      <h2
        id={id}
        className="zq-text-primary text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      <p className="zq-text-secondary mt-4 text-base leading-relaxed sm:text-lg">{subtitle}</p>
    </motion.div>
  );
}
