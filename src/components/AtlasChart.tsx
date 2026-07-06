"use client";

import { useEffect, useRef } from "react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

/**
 * The signature element of the site: an interactive celestial chart of the
 * winter sky (Orion / Taurus / Gemini / Canis Major — the sky our telescope
 * will see at first light), drawn in the engraved style of a 19th-century
 * star atlas.
 *
 * A brass field-of-view reticle slews autonomously between real targets,
 * the way the finished telescope will. Move the pointer and you take over
 * the mount; click to lock onto the nearest catalogued object. RA/Dec
 * readout is computed from the true chart projection.
 */

// [ra hours, dec degrees, magnitude, name?]
type Star = [number, number, number, string?];

const STARS: Star[] = [
  // Orion
  [5.919, 7.407, 0.45, "Betelgeuse"], // 0
  [5.242, -8.202, 0.18, "Rigel"], // 1
  [5.418, 6.35, 1.64, "Bellatrix"], // 2
  [5.533, -0.299, 2.25], // 3 Mintaka
  [5.604, -1.202, 1.69], // 4 Alnilam
  [5.679, -1.943, 1.74], // 5 Alnitak
  [5.796, -9.67, 2.07, "Saiph"], // 6
  [5.585, 9.934, 3.39], // 7 Meissa
  // Taurus
  [4.599, 16.509, 0.87, "Aldebaran"], // 8
  [5.438, 28.608, 1.65, "Elnath"], // 9
  [4.33, 15.628, 3.65], // 10 γ Tau
  [4.477, 19.18, 3.53], // 11 ε Tau
  [5.628, 21.143, 3.0], // 12 ζ Tau
  // Gemini
  [7.577, 31.888, 1.58, "Castor"], // 13
  [7.755, 28.026, 1.14, "Pollux"], // 14
  [6.629, 16.399, 1.93, "Alhena"], // 15
  [7.335, 21.982, 3.53], // 16 Wasat
  [6.732, 25.131, 3.06], // 17 Mebsuta
  // Canis Major / Minor
  [6.752, -16.716, -1.46, "Sirius"], // 18
  [6.378, -17.956, 1.98], // 19 Mirzam
  [7.655, 5.225, 0.34, "Procyon"], // 20
  [7.453, 8.289, 2.89], // 21 Gomeisa
  // Pleiades anchor
  [3.791, 24.105, 2.87], // 22 Alcyone
];

// Constellation figures as star-index pairs
const FIGURES: [number, number][] = [
  // Orion
  [0, 2], [2, 7], [7, 0], [2, 3], [0, 5], [3, 4], [4, 5], [3, 1], [5, 6], [1, 6],
  // Taurus (Hyades V + horns)
  [10, 8], [10, 11], [11, 9], [8, 12],
  // Gemini
  [14, 16], [16, 15], [13, 17], [17, 15],
  // Canis Major / Minor
  [18, 19], [20, 21],
];

interface DeepSky {
  ra: number;
  dec: number;
  label: string;
  r: number; // marker radius in px at base scale
}

const DSOS: DeepSky[] = [
  { ra: 5.588, dec: -5.391, label: "M42 · Orion Nebula", r: 11 },
  { ra: 3.791, dec: 24.105, label: "M45 · Pleiades", r: 14 },
  { ra: 5.575, dec: 22.017, label: "M1 · Crab Nebula", r: 8 },
];

interface SlewTarget {
  ra: number;
  dec: number;
  name: string;
  mag: string;
}

const SLEW_TARGETS: SlewTarget[] = [
  { ra: 5.588, dec: -5.391, name: "ORION NEBULA · M42", mag: "MAG 4.0" },
  { ra: 6.752, dec: -16.716, name: "SIRIUS · α CMA", mag: "MAG −1.46" },
  { ra: 3.791, dec: 24.105, name: "PLEIADES · M45", mag: "MAG 1.6" },
  { ra: 5.919, dec: 7.407, name: "BETELGEUSE · α ORI", mag: "MAG 0.45" },
  { ra: 5.575, dec: 22.017, name: "CRAB NEBULA · M1", mag: "MAG 8.4" },
  { ra: 5.242, dec: -8.202, name: "RIGEL · β ORI", mag: "MAG 0.18" },
  { ra: 4.599, dec: 16.509, name: "ALDEBARAN · α TAU", mag: "MAG 0.87" },
];

// Chart center + span (degrees of declination shown vertically)
const RA0 = 5.62; // hours
const DEC0 = 5.5; // degrees
const DEC_SPAN = 54;

const CHART = "143, 165, 201"; // chart blue rgb
const BRASS = "217, 168, 92";
const STARLIGHT = "237, 241, 250";

// Deterministic field stars so the render is stable
function fieldStars(count: number): [number, number, number][] {
  const out: [number, number, number][] = [];
  let s = 42;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = 0; i < count; i++) {
    out.push([rnd(), rnd(), rnd()]);
  }
  return out;
}
const FIELD = fieldStars(220);

function fmtRA(ra: number): string {
  const h = Math.floor(((ra % 24) + 24) % 24);
  const m = Math.floor((ra - Math.floor(ra)) * 60);
  return `RA ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

function fmtDec(dec: number): string {
  const sign = dec < 0 ? "−" : "+";
  const a = Math.abs(dec);
  const d = Math.floor(a);
  const m = Math.floor((a - d) * 60);
  return `DEC ${sign}${String(d).padStart(2, "0")}° ${String(m).padStart(2, "0")}′`;
}

export default function AtlasChart({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const reducedRef = useRef(true);

  useEffect(() => {
    reducedRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    // Pointer-to-local conversion rect, invalidated on resize/scroll so
    // pointermove doesn't force a layout read per event
    let wrapRect: DOMRect | null = null;
    const getRect = () => (wrapRect ??= wrap.getBoundingClientRect());

    // px per degree of declination; RA hours are 15° each
    const scale = () => height / DEC_SPAN;
    const project = (ra: number, dec: number): [number, number] => {
      // RA increases to the LEFT — the sky-chart convention (east is left)
      const x = width / 2 - (ra - RA0) * 15 * scale();
      const y = height / 2 + (DEC0 - dec) * scale();
      return [x, y];
    };
    const unproject = (x: number, y: number): [number, number] => {
      const ra = RA0 - (x - width / 2) / (15 * scale());
      const dec = DEC0 - (y - height / 2) / scale();
      return [ra, dec];
    };

    // ── Mount state ──────────────────────────────────
    const start = performance.now();
    let raf = 0;
    let visible = true;
    let pointer: { x: number; y: number } | null = null;
    let lastPointerMove = -Infinity;
    let reticle = { x: -200, y: -200, initialized: false };
    let autoIndex = 0;
    let autoChangedAt = 0;
    let locked: SlewTarget | null = null;
    let lockedAt = 0;

    // Under reduced motion the loop stops after each settled frame; events
    // (pointer, click, resize, re-entering the viewport) schedule a redraw.
    const schedule = () => {
      if (visible && !raf) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      wrapRect = null;
      const rect = getRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (!reticle.initialized) {
        const [tx, ty] = project(SLEW_TARGETS[0].ra, SLEW_TARGETS[0].dec);
        reticle = { x: tx, y: ty, initialized: true };
      }
      schedule();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const rect = getRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      lastPointerMove = performance.now();
      locked = null;
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      lastPointerMove = -Infinity;
      schedule();
    };
    const onScroll = () => {
      wrapRect = null;
    };
    const onClick = (e: PointerEvent) => {
      const rect = getRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      let best: SlewTarget | null = null;
      let bestD = 90;
      for (const t of SLEW_TARGETS) {
        const [tx, ty] = project(t.ra, t.dec);
        const d = Math.hypot(tx - px, ty - py);
        if (d < bestD) {
          bestD = d;
          best = t;
        }
      }
      if (best) {
        locked = best;
        lockedAt = performance.now() - start;
        pointer = null;
        lastPointerMove = -Infinity;
      }
      schedule();
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Drawing ──────────────────────────────────────
    // next/font registers the mono face under a hashed family name — read
    // it from the CSS variable rather than hardcoding "IBM Plex Mono"
    const dataFont =
      getComputedStyle(wrap).getPropertyValue("--font-data").trim() ||
      "ui-monospace";
    const mono = (px: number) => `${px}px ${dataFont}, ui-monospace, monospace`;

    const drawGrid = () => {
      ctx.strokeStyle = `rgba(${CHART}, 0.10)`;
      ctx.fillStyle = `rgba(${CHART}, 0.38)`;
      ctx.lineWidth = 1;
      ctx.font = mono(10);
      // RA meridians every hour (RA grows toward screen-left)
      const [raAtLeftEdge] = unproject(0, 0);
      const [raAtRightEdge] = unproject(width, 0);
      const raMin = Math.ceil(Math.min(raAtLeftEdge, raAtRightEdge));
      const raMax = Math.floor(Math.max(raAtLeftEdge, raAtRightEdge));
      if (!Number.isFinite(raMin) || !Number.isFinite(raMax)) return;
      for (let h = raMin; h <= raMax; h++) {
        const [x] = project(h, DEC0);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.fillText(`${String(((h % 24) + 24) % 24).padStart(2, "0")}h`, x + 5, height - 10);
      }
      // Declination parallels every 10°
      for (let d = -50; d <= 50; d += 10) {
        const [, y] = project(RA0, d);
        if (y < -20 || y > height + 20) continue;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.fillText(`${d >= 0 ? "+" : "−"}${String(Math.abs(d)).padStart(2, "0")}°`, 8, y - 5);
      }
    };

    const drawFieldStars = (t: number) => {
      for (let i = 0; i < FIELD.length; i++) {
        const [fx, fy, fr] = FIELD[i];
        const x = fx * width;
        const y = fy * height;
        const base = 0.06 + fr * 0.2;
        const tw = reducedRef.current
          ? 1
          : 0.75 + 0.25 * Math.sin(t / 900 + i * 1.7);
        ctx.fillStyle = `rgba(${STARLIGHT}, ${base * tw})`;
        const r = fr < 0.85 ? 0.7 : 1.1;
        ctx.fillRect(x, y, r, r);
      }
    };

    const drawFigures = (t: number) => {
      // Engraved lines draw themselves in over the first ~2.4s
      const progress = reducedRef.current
        ? 1
        : Math.min(1, (t - 300) / 2400);
      ctx.strokeStyle = `rgba(${CHART}, 0.34)`;
      ctx.lineWidth = 1;
      FIGURES.forEach(([a, b], i) => {
        const segStart = (i / FIGURES.length) * 0.7;
        const p = Math.max(0, Math.min(1, (progress - segStart) / 0.3));
        if (p <= 0) return;
        const [x1, y1] = project(STARS[a][0], STARS[a][1]);
        const [x2, y2] = project(STARS[b][0], STARS[b][1]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p);
        ctx.stroke();
      });
    };

    const drawStars = (t: number) => {
      ctx.font = mono(10);
      for (let i = 0; i < STARS.length; i++) {
        const [ra, dec, mag, name] = STARS[i];
        const [x, y] = project(ra, dec);
        const r = Math.max(0.8, 3.4 - mag * 0.75);
        const tw = reducedRef.current
          ? 1
          : 0.85 + 0.15 * Math.sin(t / 700 + i * 2.3);
        ctx.fillStyle = `rgba(${STARLIGHT}, ${Math.min(1, 0.55 + (2.5 - mag) * 0.2) * tw})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        // Diffraction spikes on the brightest stars — what our mirror will do
        if (mag < 1) {
          ctx.strokeStyle = `rgba(${STARLIGHT}, ${0.28 * tw})`;
          ctx.lineWidth = 0.75;
          const s = r * 3.2;
          ctx.beginPath();
          ctx.moveTo(x - s, y);
          ctx.lineTo(x + s, y);
          ctx.moveTo(x, y - s);
          ctx.lineTo(x, y + s);
          ctx.stroke();
        }
        if (name) {
          ctx.fillStyle = `rgba(${CHART}, 0.75)`;
          ctx.fillText(name.toUpperCase(), x + r + 5, y + 3);
        }
      }
    };

    const drawDSOs = () => {
      ctx.font = mono(10);
      for (const dso of DSOS) {
        const [x, y] = project(dso.ra, dso.dec);
        ctx.strokeStyle = `rgba(${CHART}, 0.55)`;
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, dso.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(${CHART}, 0.7)`;
        ctx.fillText(dso.label, x + dso.r + 6, y + 3);
      }
    };

    const drawReticle = (t: number) => {
      // Decide where the mount is headed
      let target: { x: number; y: number };
      let label: string | null = null;
      let sub: string | null = null;

      const userActive = pointer && t - (lastPointerMove - start) < 6000;

      // A click-lock lingers, then the mount resumes its own schedule
      if (locked && t - lockedAt > 7000) {
        locked = null;
        autoChangedAt = t;
      }

      if (locked) {
        const [tx, ty] = project(locked.ra, locked.dec);
        target = { x: tx, y: ty };
        label = locked.name;
        sub = `${locked.mag} · TARGET LOCKED`;
      } else if (userActive && pointer) {
        target = pointer;
      } else {
        // Autonomous mode: slew between catalogue targets
        if (t - autoChangedAt > 5200) {
          autoIndex = (autoIndex + 1) % SLEW_TARGETS.length;
          autoChangedAt = t;
        }
        const auto = SLEW_TARGETS[autoIndex];
        const [tx, ty] = project(auto.ra, auto.dec);
        target = { x: tx, y: ty };
        const settled = Math.hypot(reticle.x - tx, reticle.y - ty) < 3;
        if (settled) {
          label = auto.name;
          sub = `${auto.mag} · TRACKING`;
        } else {
          sub = "SLEWING…";
        }
      }

      // Ease the mount toward the target — steppers, not teleports
      const k = reducedRef.current ? 1 : 0.07;
      reticle.x += (target.x - reticle.x) * k;
      reticle.y += (target.y - reticle.y) * k;

      const { x, y } = reticle;
      const r = 30;
      const brass = `rgba(${BRASS}, 0.9)`;

      ctx.strokeStyle = brass;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      // Cardinal ticks
      ctx.beginPath();
      for (const [dx, dy] of [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ]) {
        ctx.moveTo(x + dx * (r - 4), y + dy * (r - 4));
        ctx.lineTo(x + dx * (r + 6), y + dy * (r + 6));
      }
      ctx.stroke();
      // Center dot
      ctx.fillStyle = brass;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Coordinate readout
      const [ra, dec] = unproject(x, y);
      ctx.font = mono(11);
      ctx.fillStyle = `rgba(${BRASS}, 0.95)`;
      const line1 = label ?? `${fmtRA(ra)} · ${fmtDec(dec)}`;
      const flipX = x > width - 240;
      const flipY = y > height - 70;
      const tx = flipX ? x - r - 10 : x + r + 10;
      const ty = flipY ? y - r - 22 : y + r + 20;
      ctx.textAlign = flipX ? "right" : "left";
      ctx.fillText(line1, tx, ty);
      if (label) {
        ctx.font = mono(10);
        ctx.fillStyle = `rgba(${BRASS}, 0.6)`;
        ctx.fillText(`${fmtRA(ra)} · ${fmtDec(dec)}`, tx, ty + 15);
      } else if (sub) {
        ctx.font = mono(10);
        ctx.fillStyle = `rgba(${BRASS}, 0.6)`;
        ctx.fillText(sub, tx, ty + 15);
      }
      ctx.textAlign = "left";
    };

    // `frame` is a hoisted declaration (schedule() runs before this line),
    // so TS can't narrow the outer `ctx` — re-assert the guard here.
    function frame(now: number) {
      raf = 0;
      if (!visible || !ctx) return;
      const t = now - start;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawFieldStars(t);
      drawFigures(t);
      drawStars(t);
      drawDSOs();
      drawReticle(t);
      // Reduced motion: the scene is static once drawn — don't burn frames
      if (!reducedRef.current) {
        raf = requestAnimationFrame(frame);
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
