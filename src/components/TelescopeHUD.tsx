"use client";

import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

const TARGETS = [
  { name: "M31", ra: "00h 42m", dec: "+41° 16′", alt: "38°", az: "042°" },
  { name: "Jupiter", ra: "05h 14m", dec: "+22° 48′", alt: "52°", az: "174°" },
  { name: "M42", ra: "05h 35m", dec: "−05° 23′", alt: "29°", az: "198°" },
  { name: "M13", ra: "16h 41m", dec: "+36° 28′", alt: "67°", az: "320°" },
];

// Azimuth angles in degrees for the needle to point
const TARGET_AZIMUTHS = [42, 174, 198, 320];

// Elevation angles (0=horizon, 90=zenith) for the tube
const TARGET_ELEVATIONS = [38, 52, 29, 67];

const COMPASS_LABELS = [
  { label: "N", angle: 0 },
  { label: "E", angle: 90 },
  { label: "S", angle: 180 },
  { label: "W", angle: 270 },
];

// Atlas ink: engraved chart-blue lines, brass for the moving instrument.
const CHART = (a: number) => `rgba(143, 165, 201, ${a})`;
const BRASS = (a: number) => `rgba(217, 168, 92, ${a})`;

/**
 * Animated mount-control telemetry panel for the /observe page, rendered
 * as an engraved atlas instrument: chart-line dials, a brass needle and
 * tube, mono readout rows. Aria-hidden — purely decorative.
 */
export default function TelescopeHUD() {
  const reducedMotion = usePrefersReducedMotion();
  const [targetIndex, setTargetIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setTargetIndex((i) => (i + 1) % TARGETS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  const target = TARGETS[targetIndex];
  const azimuth = TARGET_AZIMUTHS[targetIndex];
  const elevation = TARGET_ELEVATIONS[targetIndex];

  // Elevation arc: 0°=horizon maps to 90deg rotation, 90°=zenith maps to 0deg
  const tubeDeg = 90 - elevation;

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden="true"
        className="card-atlas tick-corners select-none p-5"
      >
        {/* Header chrome */}
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-chart/85">
            Mount Control · HUD
          </span>
          <div className="flex items-center gap-2.5">
            {/* TRACKING · SIM marker */}
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-chart/25 bg-chart/10 px-2 py-0.5">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-chart-bright" />
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-chart-bright">
                Tracking · SIM
              </span>
            </span>
            {/* MOUNT · IDLE marker */}
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-brass/30 bg-brass/10 px-2 py-0.5">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brass" />
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-brass-bright">
                Mount · Idle
              </span>
            </span>
          </div>
        </div>

        {/* Diagrams row */}
        <div className="mb-5 flex items-start gap-4">
          {/* Azimuth compass dial */}
          <div className="shrink-0">
            <svg
              width="120"
              height="120"
              viewBox="-60 -60 120 120"
              className="overflow-visible"
            >
              {/* Outer ring */}
              <circle
                cx="0"
                cy="0"
                r="54"
                fill="none"
                stroke={CHART(0.28)}
                strokeWidth="1"
              />
              {/* Inner ring */}
              <circle
                cx="0"
                cy="0"
                r="46"
                fill="none"
                stroke={CHART(0.12)}
                strokeWidth="1"
              />
              {/* Tick marks every 30° */}
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const isMajor = i % 3 === 0;
                const r1 = isMajor ? 48 : 50;
                const r2 = 54;
                return (
                  <line
                    key={i}
                    x1={Math.sin(angle) * r1}
                    y1={-Math.cos(angle) * r1}
                    x2={Math.sin(angle) * r2}
                    y2={-Math.cos(angle) * r2}
                    stroke={CHART(isMajor ? 0.45 : 0.2)}
                    strokeWidth={isMajor ? 1.2 : 0.8}
                  />
                );
              })}
              {/* Compass labels */}
              {COMPASS_LABELS.map(({ label, angle }) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <text
                    key={label}
                    x={Math.sin(rad) * 41}
                    y={-Math.cos(rad) * 41 + 3.5}
                    textAnchor="middle"
                    fontSize="7"
                    fill={CHART(0.7)}
                    fontFamily="monospace"
                  >
                    {label}
                  </text>
                );
              })}
              {/* Azimuth needle — brass */}
              <motion.g
                animate={reducedMotion ? {} : { rotate: azimuth }}
                initial={{ rotate: azimuth }}
                transition={{ duration: 10, ease: "easeInOut" }}
              >
                {/* Needle */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-38"
                  stroke={BRASS(0.9)}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Tail */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="12"
                  stroke={BRASS(0.4)}
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </motion.g>
              {/* Center dot */}
              <circle cx="0" cy="0" r="3" fill={BRASS(0.8)} />
              {/* Azimuth label */}
              <text
                x="0"
                y="58"
                textAnchor="middle"
                fontSize="6"
                fill={CHART(0.55)}
                fontFamily="monospace"
              >
                AZ
              </text>
            </svg>
          </div>

          {/* Elevation arc */}
          <div className="shrink-0">
            <svg
              width="80"
              height="120"
              viewBox="0 0 80 120"
              className="overflow-visible"
            >
              {/* Arc (quarter circle representing elevation) */}
              <path
                d="M 10 110 A 80 80 0 0 1 90 30"
                fill="none"
                stroke={CHART(0.28)}
                strokeWidth="1"
              />
              {/* Tick marks at 0°, 30°, 60°, 90° */}
              {[0, 30, 60, 90].map((deg) => {
                const rad = ((90 - deg) * Math.PI) / 180;
                const cx = 10 + 80 * Math.cos(rad);
                const cy = 110 - 80 * Math.sin(rad);
                return (
                  <circle
                    key={deg}
                    cx={cx}
                    cy={cy}
                    r="1.5"
                    fill={CHART(0.45)}
                  />
                );
              })}
              {/* Telescope tube — brass instrument */}
              <motion.g
                style={{ transformOrigin: "10px 110px" }}
                animate={reducedMotion ? {} : { rotate: -(tubeDeg) }}
                initial={{ rotate: -(tubeDeg) }}
                transition={{ duration: 10, ease: "easeInOut" }}
              >
                {/* Tube body */}
                <rect
                  x="-3"
                  y="-52"
                  width="6"
                  height="50"
                  rx="2"
                  fill={BRASS(0.15)}
                  stroke={BRASS(0.65)}
                  strokeWidth="0.8"
                  transform="translate(10 110)"
                />
                {/* Finder scope */}
                <rect
                  x="3"
                  y="-42"
                  width="3"
                  height="22"
                  rx="1"
                  fill={BRASS(0.1)}
                  stroke={BRASS(0.4)}
                  strokeWidth="0.6"
                  transform="translate(10 110)"
                />
              </motion.g>
              {/* Mount base */}
              <circle cx="10" cy="110" r="4" fill={BRASS(0.55)} />
              {/* ALT label */}
              <text
                x="40"
                y="118"
                textAnchor="middle"
                fontSize="6"
                fill={CHART(0.55)}
                fontFamily="monospace"
              >
                ALT
              </text>
            </svg>
          </div>
        </div>

        {/* Telemetry readout rows */}
        <div className="space-y-1.5 border-t border-chart/12 pt-3">
          {[
            { label: "TARGET", value: target.name },
            { label: "RA", value: target.ra },
            { label: "DEC", value: target.dec },
            { label: "ALT", value: target.alt },
            { label: "AZ", value: target.az },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="w-12 shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-chart/60">
                {label}
              </span>
              <motion.span
                key={`${label}-${targetIndex}`}
                initial={reducedMotion ? {} : { opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="font-mono text-[0.6875rem] text-starlight/80"
              >
                {value}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </MotionConfig>
  );
}
