"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import StarField from "./StarField";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

export default function Hero() {
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

  const handlePointerLeave = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--pointer-x", "50%");
    el.style.setProperty("--pointer-y", "38%");
    el.style.setProperty("--pointer-dx", "0");
    el.style.setProperty("--pointer-dy", "0");
  }, []);

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080B12]"
    >
      {/* Navy radial glow */}
      <div className="absolute inset-0 pointer-events-none hero-glow" />

      {/* Pointer-reactive nebula glow */}
      <div className="absolute inset-0 pointer-events-none hero-pointer-glow" />

      {/* Starfield */}
      <StarField count={110} interactive shootingStars />

      {/* Content — drifts gently opposite the pointer for depth */}
      <div className="hero-parallax relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto py-32 sm:py-40 lg:py-48">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.04] mb-8 text-xs text-[rgba(240,240,250,0.5)] tracking-[0.2em] uppercase fade-in-up">
          Student-Built Autonomous Telescope
        </div>

        {/* Headline */}
        <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-[rgba(240,240,250,1)] leading-tight tracking-tighter mb-6 fade-in-up animation-delay-200">
          Building the Future
          <br />
          of Astronomy
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-[rgba(240,240,250,0.6)] max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up animation-delay-400">
          A student-built autonomous telescope bringing the night sky
          to the Bay Area
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up animation-delay-600">
          <a
            href="#about"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-titanium-light px-8 py-3.5 font-medium rounded-full"
          >
            Learn More
          </a>
          <Link
            href="/parts"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-titanium-dark px-8 py-3.5 text-[rgba(240,240,250,0.9)] font-medium rounded-full"
          >
            View Parts List
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[rgba(240,240,250,0.3)] animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080B12] to-transparent pointer-events-none" />
    </section>
  );
}
