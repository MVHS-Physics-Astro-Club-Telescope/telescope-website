"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useInView } from "@/hooks/useInView";
import { getBudgetRange } from "@/data/parts";
import {
  getTotalRaised,
  getCashSponsorCount,
  getInKindSponsorCount,
} from "@/data/sponsors";

const R = 84;
const CIRC = 2 * Math.PI * R;

export default function FundraisingProgress() {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [animatedRaised, setAnimatedRaised] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const started = useRef(false);

  const { low, high } = getBudgetRange();
  const goal = high; // stretch goal = top end of estimated budget
  const raised = getTotalRaised();
  const remaining = Math.max(goal - raised, 0);
  const targetPercent = Math.min((raised / goal) * 100, 100);

  const cashSponsorCount = getCashSponsorCount();
  const inKindCount = getInKindSponsorCount();

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = reduceMotion ? 0 : 1800;
    let frame: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = duration === 0 ? 1 : Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedRaised(Math.round(eased * raised));
      setAnimatedPercent(eased * targetPercent);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, raised, targetPercent]);

  return (
    <section id="fundraising" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Mirror fund · Direct cash only"
          title="Filling the aperture"
          subtitle="Every dollar is one more part on the build. The ring below is our 254 mm mirror — we're filling it with light."
        />

        <Reveal>
          <div
            ref={ref}
            className="card-atlas tick-corners grid grid-cols-1 gap-10 p-8 sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-16"
          >
            {/* The aperture ring */}
            <div
              role="progressbar"
              aria-label={`Fundraising progress: ${raised.toLocaleString()} dollars raised of ${goal.toLocaleString()} dollar goal`}
              aria-valuenow={raised}
              aria-valuemin={0}
              aria-valuemax={goal}
              aria-valuetext={`${targetPercent.toFixed(0)} percent funded, ${remaining.toLocaleString()} dollars still needed`}
              className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64"
            >
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                {/* Mirror edge */}
                <circle
                  cx="100"
                  cy="100"
                  r="97"
                  fill="none"
                  stroke="rgba(143,165,201,0.25)"
                  strokeWidth="1"
                />
                {/* Scale ticks every 10% */}
                {Array.from({ length: 10 }, (_, i) => {
                  const a = (i / 10) * Math.PI * 2;
                  // Fixed precision keeps SSR and client markup identical
                  const x1 = (100 + Math.cos(a) * 92).toFixed(2);
                  const y1 = (100 + Math.sin(a) * 92).toFixed(2);
                  const x2 = (100 + Math.cos(a) * 97).toFixed(2);
                  const y2 = (100 + Math.sin(a) * 97).toFixed(2);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(143,165,201,0.4)"
                      strokeWidth="1"
                    />
                  );
                })}
                {/* Track */}
                <circle
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  stroke="rgba(143,165,201,0.14)"
                  strokeWidth="7"
                />
                {/* Funded arc */}
                <circle
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  stroke="rgba(217,168,92,0.95)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - animatedPercent / 100)}
                  style={{ filter: "drop-shadow(0 0 8px rgba(217,168,92,0.35))" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl text-starlight tabular-nums sm:text-5xl">
                  ${animatedRaised.toLocaleString()}
                </span>
                <span className="eyebrow mt-2 !text-[0.625rem]">
                  of ${goal.toLocaleString()} goal
                </span>
                <span className="mt-1.5 font-mono text-xs text-brass-bright tabular-nums">
                  {animatedPercent.toFixed(0)}% funded
                </span>
              </div>
            </div>

            {/* Ledger */}
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-3">
                <div className="border-b border-chart/12 py-5 sm:border-b-0 sm:border-r sm:py-0 sm:pr-8">
                  <div className="font-mono text-xl text-starlight tabular-nums sm:text-2xl">
                    ${low.toLocaleString()}–{high.toLocaleString()}
                  </div>
                  <div className="eyebrow mt-1.5 !text-[0.625rem]">
                    Estimated budget
                  </div>
                </div>
                <div className="border-b border-chart/12 py-5 sm:border-b-0 sm:border-r sm:px-8 sm:py-0">
                  <div className="font-mono text-xl text-starlight tabular-nums sm:text-2xl">
                    {cashSponsorCount}
                  </div>
                  <div className="eyebrow mt-1.5 !text-[0.625rem]">
                    Cash sponsors
                  </div>
                </div>
                <div className="py-5 sm:px-8 sm:py-0">
                  <div className="font-mono text-xl text-starlight tabular-nums sm:text-2xl">
                    {inKindCount}
                  </div>
                  <div className="eyebrow mt-1.5 !text-[0.625rem]">
                    In-kind sponsors
                  </div>
                </div>
              </div>

              <p className="mt-8 border-t border-chart/12 pt-6 text-xs leading-relaxed text-chart-bright/55">
                The ring counts only direct cash donations. In-kind sponsors
                provide equipment, fabrication credits, materials, or services
                that never touch our cash budget — the full roster is on the{" "}
                <a
                  href="/sponsors"
                  className="underline underline-offset-2 transition-colors hover:text-brass-bright"
                >
                  sponsors page
                </a>
                . The estimated budget reflects current pricing on every
                non-donated part on our{" "}
                <a
                  href="/parts"
                  className="underline underline-offset-2 transition-colors hover:text-brass-bright"
                >
                  parts list
                </a>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
