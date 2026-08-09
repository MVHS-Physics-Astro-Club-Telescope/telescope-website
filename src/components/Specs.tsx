"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useInView } from "@/hooks/useInView";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

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
    spec: "Romer Optics EZ GOTO drive — NEMA 23 altitude + NEMA 17 azimuth steppers on DM542 digital drivers; ToupTek AAF electronic auto-focuser.",
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
    spec: "Truss-tube Dobsonian in cabinet-grade birch. Breaks into two sections, under 50 lbs — fits in a car trunk.",
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
 * The light path through the telescope, drawn as an atlas figure with
 * true Newtonian geometry: parallel starlight reflects off the parabolic
 * primary into a converging cone, a 45° flat folds the cone sideways
 * before prime focus, and the fold lands on the camera sensor. All three
 * ray paths are equal length (as physics demands), so the animated
 * photon wavefront arrives at focus simultaneously.
 */
const FOCUS = { x: 330, y: 220 }; // folded focal point (sensor plane)

// Piecewise photon paths: entry → primary → secondary → focus.
// Derived from: primary vertex (200,470), prime focus (200,90),
// secondary flat along y = −x + 420. Times ∝ segment lengths.
const PHOTON_PATHS = [
  {
    x: [110, 110, 158.5, FOCUS.x],
    y: [36, 462, 261.5, FOCUS.y],
    times: [0, 0.527, 0.782, 1],
  },
  {
    x: [200, 200, 200, FOCUS.x],
    y: [36, 470, 220, FOCUS.y],
    times: [0, 0.533, 0.84, 1],
  },
  {
    x: [290, 290, 225.3, FOCUS.x],
    y: [36, 462, 194.7, FOCUS.y],
    times: [0, 0.527, 0.867, 1],
  },
];

function LightPath() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const reduced = usePrefersReducedMotion();

  const ray = (
    d: string,
    delay: number,
    color = "rgba(183,199,228,0.55)",
    dash?: string
  ) => (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="1.1"
      strokeDasharray={dash}
      initial={reduced ? undefined : { pathLength: 0 }}
      animate={isInView ? { pathLength: 1 } : {}}
      transition={{ duration: 0.8, delay: reduced ? 0 : delay, ease }}
    />
  );

  return (
    <div ref={ref} className="card-atlas tick-corners relative p-6 sm:p-8">
      <p className="eyebrow !text-[0.625rem]">
        Fig. 1 — Newtonian light path · f/4.48
      </p>
      <MotionConfig reducedMotion="user">
        <svg
          viewBox="0 0 400 520"
          className="mx-auto mt-4 w-full max-w-[26rem]"
          role="img"
          aria-label="Diagram of the telescope's Newtonian light path: parallel starlight reflects off the 254 millimeter parabolic primary mirror into a converging cone, a 45 degree secondary flat folds the cone sideways, and it comes to focus on the cooled camera sensor at the side of the tube."
        >
          <defs>
            <filter id="lp-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Truss tube walls */}
          <line x1="92" y1="36" x2="92" y2="486" stroke="rgba(143,165,201,0.3)" strokeWidth="1" strokeDasharray="7 5" />
          <line x1="308" y1="36" x2="308" y2="486" stroke="rgba(143,165,201,0.3)" strokeWidth="1" strokeDasharray="7 5" />

          {/* Optical axis */}
          <line x1="200" y1="36" x2="200" y2="470" stroke="rgba(143,165,201,0.12)" strokeWidth="0.75" strokeDasharray="2 6" />

          {/* Primary mirror — concave toward the sky, vertex at (200,470) */}
          <motion.path
            d="M 105 462 Q 200 478 295 462"
            fill="none"
            stroke="rgba(217,168,92,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={reduced ? undefined : { pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          />

          {/* Secondary flat — 45°, sized to the converging cone */}
          <motion.line
            x1="152"
            y1="268"
            x2="232"
            y2="188"
            stroke="rgba(217,168,92,0.9)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7, ease }}
          />

          {/* Focuser drawtube and camera, sensor plane at the folded focus */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 2.3, ease }}
          >
            <line x1="308" y1="206" x2="332" y2="206" stroke="rgba(143,165,201,0.5)" strokeWidth="1" />
            <line x1="308" y1="234" x2="332" y2="234" stroke="rgba(143,165,201,0.5)" strokeWidth="1" />
            <rect
              x="332"
              y="194"
              width="48"
              height="52"
              rx="2"
              fill="rgba(14,21,38,0.9)"
              stroke="rgba(143,165,201,0.5)"
            />
            <line x1="332" y1="204" x2="332" y2="236" stroke="rgba(228,88,78,0.7)" strokeWidth="2" />
          </motion.g>

          {/* Incoming parallel wavefront */}
          {ray("M 110 36 L 110 462", 0.3)}
          {ray("M 290 36 L 290 462", 0.4)}

          {/* Converging cone to the secondary */}
          {ray("M 110 462 L 158.5 261.5", 1.2)}
          {ray("M 290 462 L 225.3 194.7", 1.3)}
          {ray("M 200 470 L 200 220", 1.25)}

          {/* Ghost of the unfolded cone — where prime focus would be */}
          {ray("M 158.5 261.5 L 200 90", 1.9, "rgba(143,165,201,0.22)", "3 4")}
          {ray("M 225.3 194.7 L 200 90", 1.9, "rgba(143,165,201,0.22)", "3 4")}

          {/* Folded cone to the sensor */}
          {ray(`M 158.5 261.5 L ${FOCUS.x} ${FOCUS.y}`, 2.0, "rgba(217,168,92,0.7)")}
          {ray(`M 225.3 194.7 L ${FOCUS.x} ${FOCUS.y}`, 2.1, "rgba(217,168,92,0.7)")}
          {ray(`M 200 220 L ${FOCUS.x} ${FOCUS.y}`, 2.05, "rgba(217,168,92,0.7)")}

          {/* Focus pulse — fires as each photon wavefront lands */}
          {!reduced && isInView && (
            <motion.circle
              cx={FOCUS.x}
              cy={FOCUS.y}
              r="5"
              fill="rgba(240,200,128,0.9)"
              filter="url(#lp-glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: 0.9,
                delay: 6.2,
                repeat: Infinity,
                repeatDelay: 3.9,
                ease: "easeOut",
              }}
            />
          )}
          {reduced && (
            <circle cx={FOCUS.x} cy={FOCUS.y} r="3" fill="rgba(240,200,128,0.8)" />
          )}

          {/* Photon wavefront — equal path lengths, simultaneous arrival */}
          {!reduced &&
            isInView &&
            PHOTON_PATHS.map((p, i) => (
              <motion.circle
                key={i}
                r="3"
                fill="rgba(237,241,250,0.95)"
                filter="url(#lp-glow)"
                initial={{ cx: p.x[0], cy: p.y[0], opacity: 0 }}
                animate={{ cx: p.x, cy: p.y, opacity: [0, 1, 1, 1] }}
                transition={{
                  duration: 3.6,
                  delay: 3.5,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: "linear",
                  times: p.times,
                }}
              />
            ))}

          {/* Prime-focus marker */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 2.2, ease }}
          >
            <circle cx="200" cy="90" r="2.5" fill="none" stroke="rgba(143,165,201,0.5)" strokeWidth="1" strokeDasharray="2 2" />
          </motion.g>

          {/* Annotations */}
          <g
            fill="rgba(143,165,201,0.8)"
            fontFamily="var(--font-data), monospace"
            fontSize="10"
            letterSpacing="0.12em"
          >
            <text x="98" y="24">STARLIGHT · PARALLEL WAVEFRONT</text>
            <text x="98" y="505">PRIMARY · 254 MM PARABOLIC</text>
            <text x="98" y="176">SECONDARY</text>
            <text x="98" y="189">70 MM FLAT · 45°</text>
            <text x="212" y="86" fill="rgba(143,165,201,0.5)">PRIME FOCUS</text>
            <text x="392" y="266" textAnchor="end">ATR585C</text>
            <text x="392" y="279" textAnchor="end">SENSOR AT FOCUS</text>
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
