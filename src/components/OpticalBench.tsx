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

const MONO = "var(--font-data), monospace";

/**
 * Animated SVG side-view physics diagram of the Newtonian optical path,
 * drawn as an atlas figure. Aria-hidden — purely decorative.
 */
export default function OpticalBench() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden="true"
        className="card-atlas tick-corners relative overflow-hidden p-5 sm:p-6"
      >
        <p className="eyebrow !text-[0.625rem]">
          Fig. 1 — Newtonian optical path · side elevation
        </p>

        <svg
          viewBox="0 0 720 260"
          preserveAspectRatio="xMidYMid meet"
          className="mt-4 h-auto w-full"
          style={{ maxHeight: "260px" }}
        >
          {/* Open truss tube outline */}
          <rect
            x="30"
            y="55"
            width="580"
            height="155"
            rx="2"
            fill="none"
            stroke="rgba(143,165,201,0.3)"
            strokeWidth="1"
            strokeDasharray="7 5"
          />
          {/* Truss struts */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={30 + i * 145}
              y1="55"
              x2={30 + i * 145}
              y2="210"
              stroke="rgba(143,165,201,0.18)"
              strokeWidth="0.8"
            />
          ))}

          {/* PRIMARY mirror — parabolic curve at right, the brass heart */}
          <path
            d="M 600 55 Q 650 130 600 210"
            fill="none"
            stroke="rgba(217,168,92,0.9)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text
            x="658"
            y="126"
            fontSize="9"
            fill="rgba(143,165,201,0.8)"
            fontFamily={MONO}
            letterSpacing="0.1em"
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
            stroke="rgba(217,168,92,0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text
            x="180"
            y="175"
            fontSize="9"
            fill="rgba(143,165,201,0.8)"
            fontFamily={MONO}
            letterSpacing="0.1em"
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
            rx="2"
            fill="rgba(14,21,38,0.9)"
            stroke="rgba(143,165,201,0.5)"
            strokeWidth="1"
          />
          <text
            x="230"
            y="27"
            fontSize="7"
            fill="rgba(143,165,201,0.75)"
            fontFamily={MONO}
            letterSpacing="0.08em"
            textAnchor="middle"
          >
            IMX585 SENSOR
          </text>

          {/* Static ray paths (shown always — photons animate over them) */}
          {RAYS.map((ray, i) => (
            <g key={i}>
              <line
                {...ray.incoming}
                stroke="rgba(183,199,228,0.12)"
                strokeWidth="0.75"
              />
              <line
                {...ray.toSecondary}
                stroke="rgba(183,199,228,0.12)"
                strokeWidth="0.75"
              />
              <line
                {...ray.toCamera}
                stroke="rgba(183,199,228,0.12)"
                strokeWidth="0.75"
              />
            </g>
          ))}

          {/* Animated photons */}
          {!reducedMotion &&
            RAYS.map((ray, ri) => (
              <motion.circle
                key={ri}
                r="3.5"
                fill="rgba(183,199,228,0.95)"
                filter="url(#photon-glow)"
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
                fill="rgba(183,199,228,0.5)"
              />
            ))}

          {/* Soft photon glow */}
          <defs>
            <filter id="photon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </MotionConfig>
  );
}
