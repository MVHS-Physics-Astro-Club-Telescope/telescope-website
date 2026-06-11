"use client";

import { useEffect, useRef } from "react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface StarFieldProps {
  count?: number;
  /** Pointer-reactive parallax — near stars shift more than far ones. */
  interactive?: boolean;
  /** Occasional meteor streaks. Never shown under prefers-reduced-motion. */
  shootingStars?: boolean;
  className?: string;
}

interface Star {
  x: number; // unit space 0..1, survives resize
  y: number;
  depth: number; // 0.3 far .. 1 near — scales size, parallax, drift
  radius: number;
  baseAlpha: number;
  twinkleAmp: number;
  twinkleSpeed: number;
  phase: number;
  color: [number, number, number];
  driftX: number; // unit space per second
  driftY: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0..1
  decay: number;
}

const STAR_WHITE: [number, number, number] = [245, 243, 240];
const STAR_BLUE: [number, number, number] = [167, 199, 250];
const STAR_WARM: [number, number, number] = [250, 224, 188];
const PARALLAX_PX = 18;

function makeStars(count: number): Star[] {
  return Array.from({ length: count }, () => {
    const depth = 0.3 + Math.random() * 0.7;
    const roll = Math.random();
    return {
      x: Math.random(),
      y: Math.random(),
      depth,
      radius: 0.4 + Math.random() * 1.1 * depth,
      baseAlpha: 0.12 + Math.random() * 0.5 * depth,
      twinkleAmp: 0.08 + Math.random() * 0.22,
      twinkleSpeed: 0.3 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      color: roll > 0.88 ? STAR_BLUE : roll > 0.78 ? STAR_WARM : STAR_WHITE,
      driftX: -(0.002 + Math.random() * 0.004) * depth,
      driftY: (0.0008 + Math.random() * 0.0016) * depth,
    };
  });
}

/**
 * Animated deep-space starfield on a single canvas: depth-layered twinkle,
 * slow drift, optional pointer parallax and meteors. With reduced motion it
 * paints one static frame — no animation loop, no listeners.
 */
export default function StarField({
  count = 80,
  interactive = false,
  shootingStars = false,
  className = "",
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars = makeStars(count);
    const meteors: Meteor[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let nextMeteorAt = 3 + Math.random() * 5;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }; // -1..1 from center

    const drawFrame = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const twinkle = reducedMotion
          ? 0
          : Math.sin(elapsed * s.twinkleSpeed + s.phase) * s.twinkleAmp;
        const alpha = Math.min(Math.max(s.baseAlpha + twinkle, 0.04), 0.85);
        const unitX = (((s.x + elapsed * s.driftX) % 1) + 1) % 1;
        const unitY = (((s.y + elapsed * s.driftY) % 1) + 1) % 1;
        const px = unitX * width + pointer.x * s.depth * PARALLAX_PX;
        const py = unitY * height + pointer.y * s.depth * PARALLAX_PX;
        const [r, g, b] = s.color;
        ctx.beginPath();
        ctx.arc(px, py, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
        // Soft halo on the brightest near stars
        if (s.depth > 0.85 && s.radius > 1.1) {
          ctx.beginPath();
          ctx.arc(px, py, s.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`;
          ctx.fill();
        }
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const tailX = m.x - m.vx * 0.09;
        const tailY = m.y - m.vy * 0.09;
        const fade = Math.sin(m.life * Math.PI); // ease in and out
        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, "rgba(167, 199, 250, 0)");
        grad.addColorStop(1, `rgba(225, 235, 255, ${0.7 * fade})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) drawFrame(0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    if (reducedMotion) {
      // Static frame only — drawn by resize() above.
      return () => observer.disconnect();
    }

    const onPointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    let start: number | null = null;
    let last = 0;
    const tick = (now: number) => {
      if (start === null) {
        start = now;
        last = now;
      }
      const elapsed = (now - start) / 1000;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      // Ease parallax toward the pointer so motion feels weighty
      pointer.x += (pointer.targetX - pointer.x) * Math.min(dt * 4, 1);
      pointer.y += (pointer.targetY - pointer.y) * Math.min(dt * 4, 1);

      if (shootingStars && elapsed > nextMeteorAt && meteors.length < 2) {
        nextMeteorAt = elapsed + 5 + Math.random() * 8;
        const angle = Math.PI * (0.15 + Math.random() * 0.2); // shallow descent
        const speed = 420 + Math.random() * 260;
        meteors.push({
          x: width * (0.15 + Math.random() * 0.7),
          y: height * (0.05 + Math.random() * 0.3),
          vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
          vy: Math.sin(angle) * speed,
          life: 0,
          decay: 0.9 + Math.random() * 0.5,
        });
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life += m.decay * dt;
        if (m.life >= 1) meteors.splice(i, 1);
      }

      drawFrame(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      if (interactive) window.removeEventListener("pointermove", onPointerMove);
    };
  }, [count, interactive, shootingStars, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
    />
  );
}
