"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";
import { getBudgetRange } from "@/data/parts";
import { getTotalRaised, getCashSponsorCount, getInKindSponsorCount } from "@/data/sponsors";

export default function FundraisingProgress() {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [animatedRaised, setAnimatedRaised] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const { low, high } = getBudgetRange();
  const goal = high; // stretch goal = top end of estimated budget
  const raised = getTotalRaised();
  const remaining = Math.max(goal - raised, 0);
  const targetPercent = Math.min((raised / goal) * 100, 100);

  const cashSponsorCount = getCashSponsorCount();
  const inKindCount = getInKindSponsorCount();

  useEffect(() => {
    if (!isInView) return;

    // Respect prefers-reduced-motion: jump straight to final values.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setAnimatedRaised(raised);
      setAnimatedPercent(targetPercent);
      return;
    }

    const duration = 1800;
    let frame: number;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedRaised(Math.round(eased * raised));
      setAnimatedPercent(eased * targetPercent);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, raised, targetPercent]);

  return (
    <section
      id="fundraising"
      className="relative py-24 sm:py-32 bg-[#080B12]"
    >
      {/* Subtle aurora glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-[radial-gradient(ellipse,rgba(48,209,88,0.04),transparent)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Fundraising Progress"
          subtitle="Tracking our journey from first donation to first light."
        />

        <div
          ref={ref}
          className={`bg-[#0D1219] border border-white/[0.08] rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] transition-all duration-300 p-8 sm:p-10 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionProperty: "opacity, transform", transitionDuration: "700ms" }}
        >
          {/* Top: Raised vs Goal */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-heading uppercase tracking-[0.2em] text-[rgba(240,240,250,0.4)] mb-2">
                Raised toward build
              </div>
              <div className="font-heading text-5xl sm:text-6xl font-bold text-[rgba(240,240,250,1)] tabular-nums">
                ${animatedRaised.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-heading uppercase tracking-[0.2em] text-[rgba(240,240,250,0.4)] mb-2">
                Goal
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-semibold text-[rgba(240,240,250,0.7)] tabular-nums">
                ${goal.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div
            role="progressbar"
            aria-label={`Fundraising progress: ${raised.toLocaleString()} dollars raised of ${goal.toLocaleString()} dollar goal`}
            aria-valuenow={raised}
            aria-valuemin={0}
            aria-valuemax={goal}
            aria-valuetext={`${targetPercent.toFixed(0)} percent funded, ${remaining.toLocaleString()} dollars still needed`}
            className="relative h-4 w-full rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.06] mb-3"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0A84FF] via-[#30D158] to-[#5AC8FA] shadow-[0_0_20px_rgba(48,209,88,0.4)] transition-all duration-300 ease-out"
              style={{ width: `${animatedPercent}%` }}
            />
            {/* Shimmer effect */}
            <div
              aria-hidden="true"
              className="absolute top-0 h-full w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              style={{
                left: `${animatedPercent}%`,
                transform: "translateX(-100%)",
                transition: "left 1.8s ease-out",
              }}
            />
          </div>

          {/* Percentage + remaining */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-heading font-semibold text-[#30D158] tabular-nums">
              {animatedPercent.toFixed(0)}% funded
            </span>
            <span className="text-[rgba(240,240,250,0.5)] tabular-nums">
              ${remaining.toLocaleString()} still needed
            </span>
          </div>

          {/* Range note + sponsor counts */}
          <div className="mt-8 pt-8 border-t border-white/[0.06] grid grid-cols-3 gap-4 sm:gap-8">
            <div>
              <div className="font-heading text-2xl font-bold text-[rgba(240,240,250,1)] tabular-nums">
                ${low.toLocaleString()}–{high.toLocaleString()}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                Estimated range
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-[rgba(240,240,250,1)] tabular-nums">
                {cashSponsorCount}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                Cash sponsors
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-[rgba(240,240,250,1)] tabular-nums">
                {inKindCount}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                In-kind sponsors
              </div>
            </div>
          </div>

          {/* Footnote */}
          <p className="mt-6 text-xs text-[rgba(240,240,250,0.4)] leading-relaxed">
            The total reflects only direct cash donations to the project. In-kind
            sponsors are providing equipment, fabrication credits, materials, or
            services that don&apos;t flow through our cash budget &mdash; full list on the{" "}
            <a href="/sponsors" className="underline underline-offset-2 hover:text-[rgba(240,240,250,0.7)] transition-colors">
              sponsors page
            </a>
            . The estimated range reflects current pricing on every non-donated
            part on our{" "}
            <a href="/parts" className="underline underline-offset-2 hover:text-[rgba(240,240,250,0.7)] transition-colors">
              parts list
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
