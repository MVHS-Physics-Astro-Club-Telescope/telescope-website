"use client";

import { useCallback, useEffect, useRef } from "react";
import StarField from "./StarField";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface ImmersiveHeroProps {
  children: React.ReactNode;
  starCount?: number;
  shootingStars?: boolean;
  className?: string;
}

/**
 * Shared hero wrapper replicating Hero.tsx's pointer interaction so all
 * sub-pages share the home page's depth language. Wraps children in a
 * hero-parallax layer that drifts gently opposite the pointer.
 *
 * Uses the deep-space btn-starlight / btn-nebula identity.
 */
export default function ImmersiveHero({
  children,
  starCount = 70,
  shootingStars = false,
  className = "",
}: ImmersiveHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frame = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion) return;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--pointer-x", `${x * 100}%`);
        el.style.setProperty("--pointer-y", `${y * 100}%`);
        el.style.setProperty("--pointer-dx", `${x - 0.5}`);
        el.style.setProperty("--pointer-dy", `${y - 0.5}`);
      });
    },
    [reducedMotion]
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const handlePointerLeave = useCallback(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--pointer-x", "50%");
    el.style.setProperty("--pointer-y", "38%");
    el.style.setProperty("--pointer-dx", "0");
    el.style.setProperty("--pointer-dy", "0");
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative overflow-hidden bg-[#080B12] ${className}`}
    >
      {/* Navy radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none hero-glow"
      />

      {/* Pointer-reactive nebula glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none hero-pointer-glow"
      />

      {/* Starfield */}
      <StarField count={starCount} interactive shootingStars={shootingStars} />

      {/* Content drifts gently opposite the pointer for depth */}
      <div className="hero-parallax relative">
        {children}
      </div>
    </section>
  );
}
