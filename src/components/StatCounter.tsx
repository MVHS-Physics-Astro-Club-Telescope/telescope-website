"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** When true, renders in brass to pick out the cash-raised figure */
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
        className={`font-mono text-2xl tabular-nums sm:text-4xl ${
          highlight ? "text-brass-bright" : "text-starlight"
        }`}
      >
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="eyebrow mt-2 !text-[0.625rem]">
        {label}
      </div>
    </div>
  );
}
