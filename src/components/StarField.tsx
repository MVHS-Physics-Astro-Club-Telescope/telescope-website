"use client";

import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  hue: number;
}

export default function StarField({ count = 80 }: { count?: number }) {
  const stars: Star[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 3 + 5,
      delay: Math.random() * 8,
      hue: Math.random() > 0.85 ? 220 : 0,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor:
              star.hue > 0
                ? `hsla(220, 60%, 85%, ${star.opacity})`
                : `rgba(245, 243, 240, ${star.opacity})`,
            ["--star-opacity" as string]: star.opacity,
            ["--twinkle-duration" as string]: `${star.duration}s`,
            ["--twinkle-delay" as string]: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
