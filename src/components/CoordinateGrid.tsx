"use client";

import { motion, MotionConfig } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

// Three grid positions for the drifting reticle
const RETICLE_POSITIONS = [
  { x: 0, y: 0 },
  { x: 80, y: -40 },
  { x: -60, y: 30 },
];

/**
 * Decorative RA/Dec celestial graticule SVG layer for the /request hero.
 * Gently curved meridians and declination lines, mono tick labels,
 * and a drifting target reticle. Aria-hidden — purely decorative.
 */
export default function CoordinateGrid() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <svg
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          {/* Curved meridian lines (RA) */}
          {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((h, i) => {
            const x = (h / 24) * 800;
            // Gentle curve — Bézier so lines look like great circles
            return (
              <path
                key={`ra-${h}`}
                d={`M ${x + (i % 3 === 0 ? 20 : 10)} 0 Q ${x} 200 ${x - (i % 3 === 0 ? 20 : 10)} 400`}
                fill="none"
                stroke="rgba(147,197,253,0.10)"
                strokeWidth="0.8"
              />
            );
          })}

          {/* Declination lines (Dec) */}
          {[-60, -30, 0, 30, 60].map((dec) => {
            const y = ((90 - dec) / 180) * 400;
            // Slight curvature for each line
            return (
              <path
                key={`dec-${dec}`}
                d={`M 0 ${y + 15} Q 400 ${y - 8} 800 ${y + 12}`}
                fill="none"
                stroke="rgba(147,197,253,0.10)"
                strokeWidth="0.8"
              />
            );
          })}

          {/* RA tick labels */}
          {[6, 12, 18].map((h) => {
            const x = (h / 24) * 800;
            return (
              <text
                key={`ra-label-${h}`}
                x={x + 4}
                y={14}
                fontSize="9"
                fill="rgba(240,240,250,0.18)"
                fontFamily="monospace"
              >
                {h}h
              </text>
            );
          })}

          {/* Dec tick labels */}
          {[-60, -30, 0, 30, 60].map((dec) => {
            const y = ((90 - dec) / 180) * 400;
            return (
              <text
                key={`dec-label-${dec}`}
                x={6}
                y={y + 4}
                fontSize="9"
                fill="rgba(240,240,250,0.18)"
                fontFamily="monospace"
              >
                {dec > 0 ? `+${dec}°` : `${dec}°`}
              </text>
            );
          })}

          {/* Drifting target reticle */}
          {!reducedMotion ? (
            <motion.g
              animate={{
                x: RETICLE_POSITIONS.map((p) => p.x),
                y: RETICLE_POSITIONS.map((p) => p.y),
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
              style={{ originX: "400px", originY: "200px" }}
            >
              <Reticle cx={400} cy={200} reducedMotion={false} />
            </motion.g>
          ) : (
            <g>
              <Reticle cx={400} cy={200} reducedMotion={true} />
            </g>
          )}
        </svg>
      </div>
    </MotionConfig>
  );
}

function Reticle({
  cx,
  cy,
  reducedMotion,
}: {
  cx: number;
  cy: number;
  reducedMotion: boolean;
}) {
  return (
    <>
      {/* Crosshair */}
      <line
        x1={cx - 24}
        y1={cy}
        x2={cx - 8}
        y2={cy}
        stroke="rgba(147,197,253,0.5)"
        strokeWidth="1"
      />
      <line
        x1={cx + 8}
        y1={cy}
        x2={cx + 24}
        y2={cy}
        stroke="rgba(147,197,253,0.5)"
        strokeWidth="1"
      />
      <line
        x1={cx}
        y1={cy - 24}
        x2={cx}
        y2={cy - 8}
        stroke="rgba(147,197,253,0.5)"
        strokeWidth="1"
      />
      <line
        x1={cx}
        y1={cy + 8}
        x2={cx}
        y2={cy + 24}
        stroke="rgba(147,197,253,0.5)"
        strokeWidth="1"
      />
      {/* Lock ring outer */}
      <circle
        cx={cx}
        cy={cy}
        r="18"
        fill="none"
        stroke="rgba(147,197,253,0.25)"
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      {/* Lock ring inner (pulsing via CSS) */}
      <circle
        cx={cx}
        cy={cy}
        r="6"
        fill="rgba(147,197,253,0.08)"
        stroke="rgba(147,197,253,0.4)"
        strokeWidth="0.8"
        className={reducedMotion ? "" : "pulse-dot"}
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="1.5" fill="rgba(147,197,253,0.7)" />
    </>
  );
}
