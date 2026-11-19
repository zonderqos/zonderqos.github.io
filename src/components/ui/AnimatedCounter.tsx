import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedCounterProps {
  value: number;
  durationMs?: number;
  className?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  durationMs = 650,
  className,
  suffix = '',
}: AnimatedCounterProps): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [animatedValue, setAnimatedValue] = useState<number>(value);

  useEffect(() => {
    if (reducedMotion || durationMs <= 0) {
      return;
    }

    let animationFrameId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(value * eased));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [value, durationMs, reducedMotion]);

  const shownValue = reducedMotion || durationMs <= 0 ? value : animatedValue;

  return (
    <span className={className}>
      {shownValue.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}
