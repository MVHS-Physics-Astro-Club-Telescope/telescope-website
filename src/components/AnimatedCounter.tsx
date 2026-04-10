"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
  highlight?: boolean;
}

export default function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  label,
  decimals = 0,
  highlight = false,
}: AnimatedCounterProps) {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  const displayValue = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString();

  return (
    <div ref={ref} className="text-center">
      <div
        className={`font-heading text-4xl font-bold ${
          highlight
            ? "text-[#0A84FF]"
            : "text-[rgba(240,240,250,1)]"
        }`}
      >
        <span>{prefix}</span>
        <span>{displayValue}</span>
        <span className="text-[rgba(240,240,250,0.4)]">{suffix}</span>
      </div>
      <div className="mt-2 text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
        {label}
      </div>
    </div>
  );
}
