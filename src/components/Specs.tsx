"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useInView } from "@/hooks/useInView";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const stats = [
  { end: 254, suffix: " mm", label: "Aperture", decimals: 0 },
  { end: 1138, suffix: " mm", label: "Focal length", decimals: 0 },
  { end: 4.48, prefix: "f/", label: "Focal ratio", decimals: 2 },
  { end: 6800, suffix: "+", label: "Lines of code", decimals: 0 },
  { end: 328, label: "Tests passing", decimals: 0 },
];

const manifest = [
  {
    item: "Primary mirror",
    spec: '254 mm (10") f/4.48 parabolic — donated by Pacific Holographic, the optical heart of the system.',
  },
  {
    item: "Star tracking",
    spec: "INDI-compatible GoTo with plate-solving and auto-alignment. The mount knows where it's pointed.",
  },
  {
    item: "Drives",
    spec: "NEMA 23 altitude/azimuth steppers on TMC2209 silent drivers; ToupTek AAF electronic auto-focuser.",
  },
  {
    item: "Imaging",
    spec: "ToupTek ATR585C cooled deep-sky camera (Sony IMX585) with a GPM462C guide camera for closed-loop tracking.",
  },
  {
    item: "Software",
    spec: "Python + TypeScript control stack with a web dashboard and ASCOM/INDI drivers — written by students.",
  },
  {
    item: "Structure",
    spec: "Truss-tube Dobsonian in Baltic birch. Breaks into two sections, under 50 lbs — fits in a car trunk.",
  },
];

/** Counts up when scrolled into view; respects reduced motion. */
function Counter({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}) {
  const { ref, isInView } = useInView({ threshold: 0.4 });
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!isInView || done.current) return;
    done.current = true;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = reduce ? 0 : 1600;
    let raf: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = duration === 0 ? 1 : Math.min((ts - start) / duration, 1);
      setValue(end * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end]);

  return (
    <div ref={ref}>
      <div className="font-mono text-2xl text-starlight tabular-nums sm:text-3xl">
        {prefix}
        {value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </div>
      <div className="eyebrow mt-1.5 !text-[0.625rem]">{label}</div>
    </div>
  );
}

/**
 * The light path through the telescope, drawn as an atlas figure.
 * Starlight enters the tube, reflects off the parabolic primary,
 * bounces off the secondary flat, and lands on the cooled camera.
 */
function LightPath() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const ray = (d: string, delay: number, color = "rgba(183,199,228,0.75)") => (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="1.25"
      initial={{ pathLength: 0 }}
      animate={isInView ? { pathLength: 1 } : {}}
      transition={{ duration: 0.9, delay, ease }}
    />
  );

  return (
    <div ref={ref} className="card-atlas tick-corners relative p-6 sm:p-8">
      <p className="eyebrow !text-[0.625rem]">Fig. 1 — Newtonian light path</p>
      <MotionConfig reducedMotion="user">
        <svg
          viewBox="0 0 400 520"
          className="mx-auto mt-4 w-full max-w-[26rem]"
          role="img"
          aria-label="Diagram of the telescope's Newtonian light path: starlight enters the tube, reflects off the 254 millimeter parabolic primary mirror, then off the secondary flat mirror, into the cooled camera at the side of the tube."
        >
          {/* Truss tube walls */}
          <line x1="84" y1="48" x2="84" y2="488" stroke="rgba(143,165,201,0.3)" strokeWidth="1" strokeDasharray="7 5" />
          <line x1="316" y1="48" x2="316" y2="488" stroke="rgba(143,165,201,0.3)" strokeWidth="1" strokeDasharray="7 5" />

          {/* Primary mirror — the brass heart */}
          <motion.path
            d="M 92 476 Q 200 452 308 476"
            fill="none"
            stroke="rgba(217,168,92,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          />

          {/* Secondary flat */}
          <motion.line
            x1="184"
            y1="102"
            x2="216"
            y2="134"
            stroke="rgba(217,168,92,0.85)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7, ease }}
          />

          {/* Camera body */}
          <motion.rect
            x="322"
            y="96"
            width="50"
            height="44"
            rx="2"
            fill="rgba(14,21,38,0.9)"
            stroke="rgba(143,165,201,0.5)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 2.4, ease }}
          />

          {/* Incoming starlight */}
          {ray("M 128 48 L 128 464", 0.3)}
          {ray("M 272 48 L 272 466", 0.4)}
          {/* Reflected to secondary */}
          {ray("M 128 464 L 196 124", 1.2)}
          {ray("M 272 466 L 204 128", 1.3)}
          {/* Out to the camera */}
          {ray("M 200 122 L 322 118", 2.1, "rgba(217,168,92,0.8)")}

          {/* Annotations */}
          <g
            fill="rgba(143,165,201,0.8)"
            fontFamily="var(--font-data), monospace"
            fontSize="10"
            letterSpacing="0.12em"
          >
            <text x="94" y="30">STARLIGHT · PARALLEL RAYS</text>
            <text x="92" y="507">PRIMARY · 254 MM PARABOLIC</text>
            <text x="120" y="90">SECONDARY · 70 MM FLAT</text>
            <text x="240" y="160">ATR585C</text>
            <text x="240" y="173">COOLED CMOS</text>
          </g>
        </svg>
      </MotionConfig>
    </div>
  );
}

export default function Specs() {
  return (
    <section id="specs" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The instrument · 254 mm Newtonian on alt-az mount"
          title="Anatomy of a light bucket"
          subtitle="Every photon that left the Orion Nebula 1,344 years ago ends its trip on a mirror our students aligned by hand."
        />

        {/* Stats row */}
        <Reveal>
          <div className="mb-16 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-chart/15 py-8 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat) => (
              <Counter key={stat.label} {...stat} />
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Fig. 1 — light path */}
          <Reveal>
            <LightPath />
          </Reveal>

          {/* Manifest */}
          <div>
            <p className="eyebrow mb-2 !text-[0.625rem]">
              Fig. 2 — Instrument manifest
            </p>
            <dl>
              {manifest.map((row, i) => (
                <Reveal key={row.item} delay={i * 0.06}>
                  <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-chart/12 py-5 sm:grid-cols-[9rem_1fr]">
                    <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-brass">
                      {row.item}
                    </dt>
                    <dd className="text-sm leading-relaxed text-chart-bright/70">
                      {row.spec}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
