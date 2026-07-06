"use client";

import { motion, MotionConfig } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

/**
 * Side-elevation Newtonian ray diagram with true converging-cone
 * geometry. Light enters from the left, reflects off the parabolic
 * primary at right into a cone aimed at prime focus, and a 45° flat
 * folds the cone up through the focuser to the sensor. All three ray
 * paths are equal length, so the photon wavefront (which enters
 * together) arrives at the sensor together.
 *
 * Geometry: optical axis y=130, primary vertex (620,130), prime focus
 * (160,130), secondary flat along y = x − 100 centered on the axis at
 * (230,130), folded focus (230,60).
 */

const FOCUS = { x: 230, y: 60 };

const RAYS = [
  // Top marginal ray
  {
    incoming: "M 30 80 L 612 80",
    cone: "M 612 80 L 222.9 123",
    fold: `M 222.9 123 L ${FOCUS.x} ${FOCUS.y}`,
    ghost: "M 222.9 123 L 160 130",
    keyframes: {
      x: [30, 612, 222.9, FOCUS.x],
      y: [80, 80, 123, FOCUS.y],
      times: [0, 0.561, 0.939, 1],
    },
  },
  // Axial ray
  {
    incoming: "M 30 130 L 618 130",
    cone: "M 618 130 L 230 130",
    fold: `M 230 130 L ${FOCUS.x} ${FOCUS.y}`,
    ghost: null,
    keyframes: {
      x: [30, 618, 230, FOCUS.x],
      y: [130, 130, 130, FOCUS.y],
      times: [0, 0.562, 0.933, 1],
    },
  },
  // Bottom marginal ray
  {
    incoming: "M 30 180 L 612 180",
    cone: "M 612 180 L 238.7 138.7",
    fold: `M 238.7 138.7 L ${FOCUS.x} ${FOCUS.y}`,
    ghost: "M 238.7 138.7 L 160 130",
    keyframes: {
      x: [30, 612, 238.7, FOCUS.x],
      y: [180, 180, 138.7, FOCUS.y],
      times: [0, 0.561, 0.924, 1],
    },
  },
];

const MONO = "var(--font-data), monospace";

export default function OpticalBench() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden="true"
        className="card-atlas tick-corners relative overflow-hidden p-5 sm:p-6"
      >
        <p className="eyebrow !text-[0.625rem]">
          Fig. 1 — Newtonian optical path · side elevation · f/4.48
        </p>

        <svg
          viewBox="0 0 720 260"
          preserveAspectRatio="xMidYMid meet"
          className="mt-4 h-auto w-full"
          style={{ maxHeight: "260px" }}
        >
          <defs>
            <filter id="ob-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Open truss tube outline */}
          <line x1="30" y1="70" x2="614" y2="70" stroke="rgba(143,165,201,0.3)" strokeWidth="1" strokeDasharray="7 5" />
          <line x1="30" y1="190" x2="614" y2="190" stroke="rgba(143,165,201,0.3)" strokeWidth="1" strokeDasharray="7 5" />
          {/* Truss struts */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={90 + i * 120}
              y1="70"
              x2={90 + i * 120}
              y2="190"
              stroke="rgba(143,165,201,0.15)"
              strokeWidth="0.8"
            />
          ))}

          {/* Optical axis */}
          <line x1="30" y1="130" x2="620" y2="130" stroke="rgba(143,165,201,0.12)" strokeWidth="0.75" strokeDasharray="2 6" />

          {/* PRIMARY — concave toward the incoming light, vertex on axis */}
          <path
            d="M 612 72 Q 630 130 612 188"
            fill="none"
            stroke="rgba(217,168,92,0.95)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text x="638" y="126" fontSize="9" fill="rgba(143,165,201,0.8)" fontFamily={MONO} letterSpacing="0.1em">
            PRIMARY
          </text>
          <text x="638" y="139" fontSize="9" fill="rgba(143,165,201,0.6)" fontFamily={MONO} letterSpacing="0.1em">
            254MM F/4.48
          </text>

          {/* SECONDARY — 45° flat, sized to the cone it intercepts */}
          <line
            x1="210"
            y1="110"
            x2="252"
            y2="152"
            stroke="rgba(217,168,92,0.9)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text x="231" y="175" fontSize="9" fill="rgba(143,165,201,0.8)" fontFamily={MONO} letterSpacing="0.1em" textAnchor="middle">
            SECONDARY · 70MM FLAT
          </text>

          {/* Ghost of the unfolded cone → prime focus */}
          {RAYS.map(
            (ray, i) =>
              ray.ghost && (
                <path
                  key={`g${i}`}
                  d={ray.ghost}
                  fill="none"
                  stroke="rgba(143,165,201,0.18)"
                  strokeWidth="0.75"
                  strokeDasharray="3 4"
                />
              )
          )}
          <circle cx="160" cy="130" r="2.5" fill="none" stroke="rgba(143,165,201,0.45)" strokeWidth="1" strokeDasharray="2 2" />
          <text x="160" y="152" fontSize="8" fill="rgba(143,165,201,0.5)" fontFamily={MONO} letterSpacing="0.08em" textAnchor="middle">
            PRIME FOCUS
          </text>

          {/* Focuser drawtube through the top wall */}
          <line x1="216" y1="70" x2="216" y2="58" stroke="rgba(143,165,201,0.5)" strokeWidth="1" />
          <line x1="244" y1="70" x2="244" y2="58" stroke="rgba(143,165,201,0.5)" strokeWidth="1" />

          {/* Camera — sensor plane at the folded focus */}
          <rect x="206" y="14" width="48" height="42" rx="2" fill="rgba(14,21,38,0.9)" stroke="rgba(143,165,201,0.5)" strokeWidth="1" />
          <line x1="216" y1="60" x2="244" y2="60" stroke="rgba(228,88,78,0.7)" strokeWidth="2" />
          <text x="230" y="34" fontSize="7" fill="rgba(143,165,201,0.75)" fontFamily={MONO} letterSpacing="0.08em" textAnchor="middle">
            IMX585
          </text>
          <text x="230" y="45" fontSize="7" fill="rgba(143,165,201,0.55)" fontFamily={MONO} letterSpacing="0.08em" textAnchor="middle">
            SENSOR
          </text>

          {/* Static ray paths — photons animate over them */}
          {RAYS.map((ray, i) => (
            <g key={i}>
              <path d={ray.incoming} fill="none" stroke="rgba(183,199,228,0.16)" strokeWidth="0.75" />
              <path d={ray.cone} fill="none" stroke="rgba(183,199,228,0.16)" strokeWidth="0.75" />
              <path d={ray.fold} fill="none" stroke="rgba(217,168,92,0.3)" strokeWidth="0.75" />
            </g>
          ))}

          {/* Photon wavefront — enters together, arrives together */}
          {!reducedMotion &&
            RAYS.map((ray, ri) => (
              <motion.circle
                key={ri}
                r="3.5"
                fill="rgba(237,241,250,0.95)"
                filter="url(#ob-glow)"
                initial={{ cx: ray.keyframes.x[0], cy: ray.keyframes.y[0] }}
                animate={{ cx: ray.keyframes.x, cy: ray.keyframes.y }}
                transition={{
                  duration: 4,
                  delay: 0.8,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: "linear",
                  times: ray.keyframes.times,
                }}
              />
            ))}

          {/* Focus pulse when the wavefront lands */}
          {!reducedMotion && (
            <motion.circle
              cx={FOCUS.x}
              cy={FOCUS.y}
              r="5"
              fill="rgba(240,200,128,0.9)"
              filter="url(#ob-glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: 0.9,
                delay: 4.8,
                repeat: Infinity,
                repeatDelay: 4.3,
                ease: "easeOut",
              }}
            />
          )}

          {/* Static markers under reduced motion */}
          {reducedMotion && (
            <>
              {RAYS.map((ray, ri) => (
                <circle
                  key={ri}
                  cx={ray.keyframes.x[1]}
                  cy={ray.keyframes.y[1]}
                  r="3"
                  fill="rgba(183,199,228,0.5)"
                />
              ))}
              <circle cx={FOCUS.x} cy={FOCUS.y} r="3" fill="rgba(240,200,128,0.8)" />
            </>
          )}

          {/* Incoming light label */}
          <text x="30" y="60" fontSize="9" fill="rgba(143,165,201,0.8)" fontFamily={MONO} letterSpacing="0.1em">
            STARLIGHT · PARALLEL WAVEFRONT
          </text>
        </svg>
      </div>
    </MotionConfig>
  );
}
