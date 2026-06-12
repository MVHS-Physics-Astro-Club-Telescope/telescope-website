"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** When true, renders in green (#30D158) to match the cash-raised highlight */
  highlight?: boolean;
}

/**
 * Count-up stat display for the sponsors page stats strip.
 * Counts from 0 to `value` using an ease-out cubic, triggered when
 * the element enters the viewport.
 */
export default function StatCounter({
  value,
  prefix = "",
  suffix = "",
  label,
  highlight = false,
}: StatCounterProps) {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [count, setCount] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    const duration = reducedMotion ? 0 : 2000;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = reducedMotion ? 1 : 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, reducedMotion]);

  return (
    <div ref={ref} className="text-center">
      <div
        className={`font-heading text-3xl sm:text-4xl font-bold tabular-nums ${
          highlight ? "text-[#30D158]" : "text-[rgba(240,240,250,1)]"
        }`}
      >
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
        {label}
      </div>
    </div>
  );
}
