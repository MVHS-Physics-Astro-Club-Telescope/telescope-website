"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { getBudgetRange } from "@/data/parts";
import { getTotalRaised } from "@/data/sponsors";

// The 3D canvas is client-only and lazy: it never blocks first paint.
const ShowcaseCanvas = dynamic(() => import("./showcase/ShowcaseCanvas"), {
  ssr: false,
});

// Deterministic star backdrop
const STARS: [number, number, number][] = (() => {
  const out: [number, number, number][] = [];
  let s = 21;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = 0; i < 70; i++) out.push([rnd() * 100, rnd() * 100, rnd()]);
  return out;
})();

/**
 * Apple-style product story: the telescope, pinned in 3D, while short
 * copy beats scroll past. Text lives in normal document flow — only the
 * canvas is sticky — so there's no scroll-hijacking and no layout work
 * per frame.
 */

type Beat = {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
  side: "start" | "end" | "center";
  stats?: [string, string][];
};

function useBeats(): Beat[] {
  const { high } = getBudgetRange();
  const raised = getTotalRaised();
  return [
    {
      eyebrow: "MVHS Physics & Astronomy Club",
      title: "Meet the telescope.",
      body: "Designed and built from raw materials by seven students.",
      side: "center",
    },
    {
      eyebrow: "The optics",
      title: "254 mm of glass.",
      body: "A donated parabolic primary, aligned by hand.",
      side: "start",
      stats: [
        ["254 mm", "aperture"],
        ["f/4.48", "focal ratio"],
        ["1138 mm", "focal length"],
      ],
    },
    {
      eyebrow: "The mount",
      title: "It aims itself.",
      body: "GoTo drives and plate-solving lock onto anything in the sky.",
      side: "end",
    },
    {
      eyebrow: "The camera",
      title: "A cooled, deep-sky eye.",
      body: "ToupTek ATR585C main imager with a guide camera riding along.",
      side: "start",
    },
    {
      eyebrow: "The build",
      title: "Every part, by hand.",
      side: "end",
      stats: [
        ["Truss ×8", "under 50 lbs"],
        ["NEMA 23", "silent drives"],
        ["Pi 4", "6,800+ lines"],
        ["Birch ply", "student-cut"],
      ],
    },
    {
      eyebrow: "First light · August 2026",
      title: "Point it at anything.",
      body: `$${raised.toLocaleString()} of $${high.toLocaleString()} raised — sponsors are engraved on the telescope itself.`,
      side: "center",
    },
  ];
}

function BeatBlock({ beat, last }: { beat: Beat; last: boolean }) {
  const justify =
    beat.side === "center"
      ? "justify-center text-center"
      : beat.side === "start"
        ? "justify-start"
        : "justify-end";
  return (
    <div className={`flex min-h-svh items-center px-6 sm:px-12 lg:px-20 ${justify}`}>
      <Reveal className="pointer-events-auto max-w-md">
        <p className="eyebrow mb-4 !text-[0.625rem]">{beat.eyebrow}</p>
        <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-starlight sm:text-6xl">
          {beat.title}
        </h2>
        {beat.body && (
          <p className="mt-4 text-base leading-relaxed text-chart-bright/75 sm:text-lg">
            {beat.body}
          </p>
        )}
        {beat.stats && (
          <dl
            className={`mt-6 grid gap-x-8 gap-y-4 ${
              beat.stats.length > 3 ? "grid-cols-2" : "grid-cols-3"
            } ${beat.side === "center" ? "justify-items-center" : ""}`}
          >
            {beat.stats.map(([v, l]) => (
              <div key={l}>
                <dt className="font-mono text-lg text-starlight sm:text-xl">{v}</dt>
                <dd className="eyebrow mt-1 !text-[0.5625rem]">{l}</dd>
              </div>
            ))}
          </dl>
        )}
        {last && (
          <div
            className={`mt-8 flex flex-wrap gap-3 ${
              beat.side === "center" ? "justify-center" : ""
            }`}
          >
            <Link href="/#support" className="btn-brass px-7 py-3 text-sm">
              Back the build
            </Link>
            <Link href="/request" className="btn-line px-7 py-3 text-sm">
              Request a target
            </Link>
          </div>
        )}
      </Reveal>
    </div>
  );
}

export default function TelescopeShowcase() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const beats = useBeats();

  return (
    <section ref={ref} id="about" className="relative">
      {/* Waypoint for the nav's Instrument link */}
      <div id="specs" aria-hidden="true" className="absolute top-[55%]" />

      {/* Pinned 3D stage (skipped under reduced motion) */}
      {!reduced && (
        <div className="pointer-events-none sticky top-0 z-0 h-svh w-full">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 50% at 55% 45%, rgba(43,58,94,0.3), transparent 65%)",
            }}
          />
          {/* Static star field — zero runtime cost */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            {STARS.map(([x, y, r], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r < 0.8 ? 0.07 : 0.14}
                fill={`rgba(237,241,250,${0.2 + r * 0.5})`}
              />
            ))}
          </svg>
          <ShowcaseCanvas sectionRef={ref} />
        </div>
      )}

      {/* Copy beats — normal flow, scrolling over the stage */}
      <div className={`pointer-events-none relative z-10 ${reduced ? "" : "-mt-[100svh]"}`}>
        {beats.map((beat, i) => (
          <BeatBlock key={i} beat={beat} last={i === beats.length - 1} />
        ))}
      </div>
    </section>
  );
}
