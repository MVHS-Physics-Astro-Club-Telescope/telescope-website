"use client";

import { useRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface SponsorConstellationProps {
  sponsorCount: number;
}

// Deterministic pseudo-random based on index — no Math.random() in render
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getNodePositions(count: number, width: number, height: number) {
  const margin = { x: 40, y: 30 };
  return Array.from({ length: count }, (_, i) => ({
    x: margin.x + seededRandom(i * 7 + 1) * (width - margin.x * 2),
    y: margin.y + seededRandom(i * 7 + 3) * (height - margin.y * 2),
    brightness: seededRandom(i * 7 + 5), // 0..1, higher = brighter
  }));
}

// Build constellation edges connecting nearby nodes
function getEdges(
  nodes: { x: number; y: number }[],
  maxEdges: number
): [number, number][] {
  const edges: [number, number][] = [];
  // Connect each node to 1-2 nearest neighbors
  for (let i = 0; i < nodes.length && edges.length < maxEdges; i++) {
    const dists = nodes
      .map((n, j) => ({
        j,
        d:
          i !== j
            ? Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y)
            : Infinity,
      }))
      .sort((a, b) => a.d - b.d);
    const nearest = dists.slice(0, 2);
    for (const { j } of nearest) {
      const key: [number, number] = i < j ? [i, j] : [j, i];
      if (!edges.some(([a, b]) => a === key[0] && b === key[1])) {
        edges.push(key);
      }
    }
  }
  return edges;
}

const W = 800;
const H = 300;

/**
 * SVG constellation spanning a wide band. One star node per sponsor,
 * connected by thin constellation lines that draw themselves on scroll.
 * Aria-hidden — purely decorative.
 */
export default function SponsorConstellation({
  sponsorCount,
}: SponsorConstellationProps) {
  const reducedMotion = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);

  const nodes = getNodePositions(sponsorCount, W, H);
  const edges = getEdges(nodes, sponsorCount * 2);

  // Top 3 by brightness get diffraction spikes
  const brightIndices = [...nodes.map((n, i) => ({ i, b: n.brightness }))]
    .sort((a, b) => b.b - a.b)
    .slice(0, 3)
    .map((x) => x.i);

  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden="true" className="w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto"
          style={{ maxHeight: "300px" }}
        >
          {/* Constellation lines */}
          {edges.map(([a, b], ei) => {
            const na = nodes[a];
            const nb = nodes[b];
            const pathId = `line-${a}-${b}`;
            return (
              <g key={pathId}>
                {!reducedMotion && (
                  <motion.path
                    d={`M ${na.x} ${na.y} L ${nb.x} ${nb.y}`}
                    fill="none"
                    stroke="rgba(147,197,253,0.25)"
                    strokeWidth="0.8"
                    pathLength="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      pathLength: {
                        duration: 1.6,
                        delay: ei * (1.6 / Math.max(edges.length, 1)),
                        ease: "easeInOut",
                      },
                      opacity: { duration: 0.3, delay: ei * (1.6 / Math.max(edges.length, 1)) },
                    }}
                  />
                )}
                {/* Static path shown under reduced motion */}
                {reducedMotion && (
                  <path
                    d={`M ${na.x} ${na.y} L ${nb.x} ${nb.y}`}
                    fill="none"
                    stroke="rgba(147,197,253,0.25)"
                    strokeWidth="0.8"
                  />
                )}
              </g>
            );
          })}

          {/* Star nodes */}
          {nodes.map((node, i) => {
            const r = 2 + node.brightness * 3;
            const twinkleDuration = 3 + seededRandom(i * 3) * 4;
            const twinkleDelay = seededRandom(i * 3 + 1) * 3;
            const isBright = brightIndices.includes(i);

            return (
              <g key={i}>
                {/* Soft aurora halo */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r * 4}
                  fill="rgba(147,197,253,0.04)"
                />
                {/* 4-point diffraction spikes on brightest nodes */}
                {isBright && (
                  <>
                    <line
                      x1={node.x - r * 3.5}
                      y1={node.y}
                      x2={node.x + r * 3.5}
                      y2={node.y}
                      stroke="rgba(147,197,253,0.3)"
                      strokeWidth="0.6"
                    />
                    <line
                      x1={node.x}
                      y1={node.y - r * 3.5}
                      x2={node.x}
                      y2={node.y + r * 3.5}
                      stroke="rgba(147,197,253,0.3)"
                      strokeWidth="0.6"
                    />
                  </>
                )}
                {/* Star circle with twinkle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill="rgba(147,197,253,0.9)"
                  className="star"
                  style={
                    {
                      "--twinkle-duration": `${twinkleDuration}s`,
                      "--twinkle-delay": `${twinkleDelay}s`,
                    } as React.CSSProperties
                  }
                />
              </g>
            );
          })}
        </svg>
      </div>
    </MotionConfig>
  );
}
