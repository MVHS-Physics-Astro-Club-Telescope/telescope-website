"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import SponsorButton from "./SponsorButton";
import { useInView } from "@/hooks/useInView";
import { getBudgetRange } from "@/data/parts";
import { getTotalRaised } from "@/data/sponsors";

const R = 84;
const CIRC = 2 * Math.PI * R;

/** Fundraising + sponsorship, condensed to one section. */
export default function SupportCompact() {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [animatedRaised, setAnimatedRaised] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const started = useRef(false);

  const { high: goal } = getBudgetRange();
  const raised = getTotalRaised();
  const remaining = Math.max(goal - raised, 0);
  const targetPercent = Math.min((raised / goal) * 100, 100);

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
    <section id="support" className="relative py-16 pb-24 sm:py-20 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div
            ref={ref}
            className="card-atlas tick-corners tick-corners-brass grid grid-cols-1 items-center gap-10 p-8 sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-14"
          >
            {/* The aperture ring */}
            <div
              role="progressbar"
              aria-label={`Fundraising progress: ${raised.toLocaleString()} dollars raised of ${goal.toLocaleString()} dollar goal`}
              aria-valuenow={raised}
              aria-valuemin={0}
              aria-valuemax={goal}
              aria-valuetext={`${targetPercent.toFixed(0)} percent funded, ${remaining.toLocaleString()} dollars still needed`}
              className="relative mx-auto h-52 w-52 sm:h-56 sm:w-56"
            >
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                <circle cx="100" cy="100" r="97" fill="none" stroke="rgba(143,165,201,0.25)" strokeWidth="1" />
                <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(143,165,201,0.14)" strokeWidth="7" />
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
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-3xl text-starlight tabular-nums sm:text-4xl">
                  ${animatedRaised.toLocaleString()}
                </span>
                <span className="eyebrow mt-1.5 !text-[0.625rem]">
                  of ${goal.toLocaleString()} goal
                </span>
              </div>
            </div>

            {/* The ask */}
            <div>
              <p className="eyebrow mb-3">
                Sponsorship · Tax-deductible via MVLA school district
              </p>
              <h2 className="max-w-md font-display text-3xl leading-tight text-starlight sm:text-4xl">
                Put your name on the telescope
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-chart-bright/70 sm:text-base">
                Every sponsor is engraved on the instrument, thanked at every
                star party, and invited to First Light in August 2026. $10 or
                $100 — it all becomes optics, electronics, and plywood.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <SponsorButton className="btn-brass px-7 py-3 text-sm">
                  Become a sponsor
                </SponsorButton>
                <a
                  href="/sponsors"
                  className="font-mono text-xs uppercase tracking-[0.14em] text-chart-bright/70 underline underline-offset-4 transition-colors hover:text-brass-bright"
                >
                  See our sponsors
                </a>
                <a
                  href="/parts"
                  className="font-mono text-xs uppercase tracking-[0.14em] text-chart-bright/70 underline underline-offset-4 transition-colors hover:text-brass-bright"
                >
                  Parts list
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
