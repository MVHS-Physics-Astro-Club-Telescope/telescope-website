"use client";

import { motion, MotionConfig } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

// Ray path segments for each of 3 parallel light rays
// Each segment: from → bounce at primary → fold at secondary → up to camera
// Incoming: left → primary (right side)
// Primary to secondary: diagonally converging
// Secondary to camera: upward fold

const RAYS = [
  // Top ray
  {
    incoming: { x1: 30, y1: 70, x2: 600, y2: 70 },
    toSecondary: { x1: 600, y1: 70, x2: 220, y2: 120 },
    toCamera: { x1: 220, y1: 120, x2: 220, y2: 30 },
    keyframes: {
      x: [30, 600, 220, 220],
      y: [70, 70, 120, 30],
    },
  },
  // Middle ray
  {
    incoming: { x1: 30, y1: 130, x2: 600, y2: 130 },
    toSecondary: { x1: 600, y1: 130, x2: 230, y2: 128 },
    toCamera: { x1: 230, y1: 128, x2: 230, y2: 30 },
    keyframes: {
      x: [30, 600, 230, 230],
      y: [130, 130, 128, 30],
    },
  },
  // Bottom ray
  {
    incoming: { x1: 30, y1: 190, x2: 600, y2: 190 },
    toSecondary: { x1: 600, y1: 190, x2: 240, y2: 136 },
    toCamera: { x1: 240, y1: 136, x2: 240, y2: 30 },
    keyframes: {
      x: [30, 600, 240, 240],
      y: [190, 190, 136, 30],
    },
  },
];

/**
 * Animated SVG side-view physics diagram of the Newtonian optical path.
 * Aria-hidden — purely decorative.
 */
export default function OpticalBench() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden="true"
        className="rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] p-4 overflow-hidden relative"
      >
        {/* Slow-rotating orbital ring decoration */}
        <div
          className="absolute -bottom-8 -right-8 pointer-events-none"
          style={{
            animation: reducedMotion ? "none" : "orbit-ring 48s linear infinite",
          }}
        >
          <svg width="160" height="160" viewBox="-80 -80 160 160">
            <ellipse
              cx="0"
              cy="0"
              rx="70"
              ry="28"
              fill="none"
              stroke="rgba(147,197,253,0.06)"
              strokeWidth="1"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="55"
              ry="20"
              fill="none"
              stroke="rgba(147,197,253,0.04)"
              strokeWidth="0.8"
              transform="rotate(30)"
            />
            <circle cx="70" cy="0" r="2.5" fill="rgba(147,197,253,0.2)" />
          </svg>
        </div>

        <svg
          viewBox="0 0 720 260"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto"
          style={{ maxHeight: "260px" }}
        >
          {/* Open truss tube outline */}
          <rect
            x="30"
            y="55"
            width="580"
            height="155"
            rx="4"
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
            strokeDasharray="8 4"
          />
          {/* Truss struts */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={30 + i * 145}
              y1="55"
              x2={30 + i * 145}
              y2="210"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="0.8"
            />
          ))}

          {/* PRIMARY mirror — parabolic curve at right */}
          <path
            d="M 600 55 Q 650 130 600 210"
            fill="none"
            stroke="rgba(147,197,253,0.55)"
            strokeWidth="2"
          />
          <text
            x="658"
            y="126"
            fontSize="9"
            fill="rgba(147,197,253,0.65)"
            fontFamily="monospace"
            textAnchor="start"
          >
            PRIMARY · 254mm f/4.48
          </text>

          {/* SECONDARY flat mirror at ~45° */}
          <line
            x1="205"
            y1="105"
            x2="255"
            y2="155"
            stroke="rgba(147,197,253,0.45)"
            strokeWidth="2"
          />
          <text
            x="180"
            y="175"
            fontSize="9"
            fill="rgba(147,197,253,0.62)"
            fontFamily="monospace"
            textAnchor="middle"
          >
            SECONDARY
          </text>

          {/* Camera box at top */}
          <rect
            x="205"
            y="8"
            width="50"
            height="30"
            rx="3"
            fill="rgba(147,197,253,0.08)"
            stroke="rgba(147,197,253,0.3)"
            strokeWidth="1"
          />
          <text
            x="230"
            y="27"
            fontSize="7"
            fill="rgba(147,197,253,0.6)"
            fontFamily="monospace"
            textAnchor="middle"
          >
            IMX585 SENSOR
          </text>

          {/* Static ray paths (shown always — photons animate over them) */}
          {RAYS.map((ray, i) => (
            <g key={i}>
              <line
                {...ray.incoming}
                stroke="rgba(147,197,253,0.08)"
                strokeWidth="0.7"
              />
              <line
                {...ray.toSecondary}
                stroke="rgba(147,197,253,0.08)"
                strokeWidth="0.7"
              />
              <line
                {...ray.toCamera}
                stroke="rgba(147,197,253,0.08)"
                strokeWidth="0.7"
              />
            </g>
          ))}

          {/* Animated photons */}
          {!reducedMotion &&
            RAYS.map((ray, ri) => (
              <motion.circle
                key={ri}
                r="3.5"
                fill="rgba(147,197,253,0.9)"
                filter="url(#glow)"
                initial={{ cx: ray.keyframes.x[0], cy: ray.keyframes.y[0] }}
                animate={{
                  cx: ray.keyframes.x,
                  cy: ray.keyframes.y,
                }}
                transition={{
                  duration: 4,
                  delay: ri * 1.2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: "linear",
                  times: [0, 0.6, 0.8, 1],
                }}
              />
            ))}

          {/* Static photon indicators under reduced motion */}
          {reducedMotion &&
            RAYS.map((ray, ri) => (
              <circle
                key={ri}
                cx={ray.keyframes.x[1]}
                cy={ray.keyframes.y[1]}
                r="3"
                fill="rgba(147,197,253,0.5)"
              />
            ))}

          {/* Aurora glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <style>{`
          @keyframes orbit-ring {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </MotionConfig>
  );
}
