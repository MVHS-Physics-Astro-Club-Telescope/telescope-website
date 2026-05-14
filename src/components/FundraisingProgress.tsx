"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";
import { getBudgetRange } from "@/data/parts";
import { getTotalCashRaised, getInKindBuildValue } from "@/data/sponsors";

export default function FundraisingProgress() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  const { low, high } = getBudgetRange();
  const goal = high; // stretch goal = top end of estimated budget
  const cash = getTotalCashRaised();
  const inKind = getInKindBuildValue();
  const committed = cash + inKind;
  const remaining = Math.max(goal - committed, 0);

  // Percentages of the full bar (which represents `goal`).
  const cashPercent = Math.min((cash / goal) * 100, 100);
  const inKindPercent = Math.min(
    (inKind / goal) * 100,
    Math.max(100 - cashPercent, 0),
  );
  const fundedPercent = Math.min(((cash + inKind) / goal) * 100, 100);

  const [animatedCash, setAnimatedCash] = useState(0);
  const [animatedInKind, setAnimatedInKind] = useState(0);
  const [animatedCashPct, setAnimatedCashPct] = useState(0);
  const [animatedInKindPct, setAnimatedInKindPct] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setAnimatedCash(cash);
      setAnimatedInKind(inKind);
      setAnimatedCashPct(cashPercent);
      setAnimatedInKindPct(inKindPercent);
      return;
    }

    const duration = 1800;
    let frame: number;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedCash(Math.round(eased * cash));
      setAnimatedInKind(Math.round(eased * inKind));
      setAnimatedCashPct(eased * cashPercent);
      setAnimatedInKindPct(eased * inKindPercent);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, cash, inKind, cashPercent, inKindPercent]);

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
          {/* Top: Committed vs Goal */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-heading uppercase tracking-[0.2em] text-[rgba(240,240,250,0.4)] mb-2">
                Raised toward build
              </div>
              <div className="font-heading text-5xl sm:text-6xl font-bold text-[rgba(240,240,250,1)] tabular-nums">
                ${(animatedCash + animatedInKind).toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-[rgba(240,240,250,0.5)] tabular-nums">
                <span className="text-[#5AC8FA]">${animatedCash.toLocaleString()} cash</span>
                <span className="mx-2 text-[rgba(240,240,250,0.3)]">+</span>
                <span className="text-[#FF9F0A]">${animatedInKind.toLocaleString()} in kind</span>
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

          {/*
            A11y note: a single role="progressbar" with aria-valuetext is used
            (rather than nested progressbars) because screen readers treat the
            fundraising bar as one composite measurement. aria-valuetext spells
            out all three segments so AT users get the full breakdown without
            needing to navigate child elements.
          */}
          <div
            role="progressbar"
            aria-label="Fundraising progress: cash raised, value covered by in-kind sponsorship, and amount still needed."
            aria-valuenow={committed}
            aria-valuemin={0}
            aria-valuemax={goal}
            aria-valuetext={`${cash.toLocaleString()} dollars cash raised, ${inKind.toLocaleString()} dollars saved by in-kind sponsorship, ${remaining.toLocaleString()} dollars still needed of a ${goal.toLocaleString()} dollar goal.`}
            className="relative flex h-4 w-full rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.06] mb-3"
          >
            {/* Segment 1 — cash raised (blue → green) */}
            <div
              aria-hidden="true"
              className="h-full bg-gradient-to-r from-[#0A84FF] via-[#30D158] to-[#5AC8FA] shadow-[0_0_20px_rgba(48,209,88,0.4)] transition-[width] duration-300 ease-out"
              style={{ width: `${animatedCashPct}%` }}
            />
            {/* Segment 2 — in-kind / saved by sponsorship (warm amber) */}
            <div
              aria-hidden="true"
              className="h-full bg-gradient-to-r from-[#ff9f0a] to-[#ff6b35] shadow-[0_0_20px_rgba(255,159,10,0.35)] transition-[width] duration-300 ease-out"
              style={{ width: `${animatedInKindPct}%` }}
            />
            {/* Segment 3 — remainder track stays exposed via the parent bg. */}
          </div>

          {/* Legend / status line */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
            <span className="font-heading font-semibold text-[#30D158] tabular-nums">
              {fundedPercent.toFixed(0)}% covered
            </span>
            <span className="text-[rgba(240,240,250,0.5)] tabular-nums">
              ${remaining.toLocaleString()} still needed
            </span>
          </div>

          {/* Three-cell stat grid */}
          <div className="mt-8 pt-8 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#0A84FF]" aria-hidden="true" />
                <div className="text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                  Cash raised
                </div>
              </div>
              <div className="font-heading text-2xl font-bold text-[#5AC8FA] tabular-nums">
                ${cash.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#FF9F0A]" aria-hidden="true" />
                <div className="text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                  Saved by sponsorship
                </div>
              </div>
              <div className="font-heading text-2xl font-bold text-[#FF9F0A] tabular-nums">
                ${inKind.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-white/30" aria-hidden="true" />
                <div className="text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
                  Still needed
                </div>
              </div>
              <div className="font-heading text-2xl font-bold text-[rgba(240,240,250,0.9)] tabular-nums">
                ${remaining.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Total committed line */}
          <p className="mt-4 text-xs text-[rgba(240,240,250,0.5)] tabular-nums">
            Total committed: ${committed.toLocaleString()} of ${goal.toLocaleString()}
            <span className="text-[rgba(240,240,250,0.35)]"> (budget range ${low.toLocaleString()}–${high.toLocaleString()})</span>
          </p>

          {/* Footnote */}
          <p className="mt-4 text-xs text-[rgba(240,240,250,0.4)] leading-relaxed">
            &ldquo;Saved by sponsorship&rdquo; reflects the retail dollar value of donated
            parts going ONTO the telescope &mdash; mirror, fabrication credits, and
            cameras. Outreach donations (smart telescopes, kits) appear on the{" "}
            <a href="/sponsors" className="underline underline-offset-2 hover:text-[rgba(240,240,250,0.7)] transition-colors">
              sponsors page
            </a>{" "}
            but don&apos;t reduce build cost. The estimated range reflects current
            pricing on every non-donated part on our{" "}
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
