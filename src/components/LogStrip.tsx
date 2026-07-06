"use client";

import Reveal from "./Reveal";

const entries = [
  { stamp: "APR 2026", title: "Design & planning", status: "active" },
  { stamp: "MAY 2026", title: "Fabrication & assembly", status: "next" },
  { stamp: "JUN–JUL", title: "Electronics & software", status: "next" },
  { stamp: "AUG 2026", title: "First light & star parties", status: "next" },
] as const;

/** The build schedule, one line per phase. */
export default function LogStrip() {
  return (
    <section id="timeline" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 flex items-baseline gap-6">
            <p className="eyebrow">Observing log · Concept to first light in six months</p>
            <div className="chart-rule hidden flex-1 sm:block" aria-hidden="true" />
          </div>
        </Reveal>

        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded border border-chart/15 bg-chart/15 sm:grid-cols-4">
          {entries.map((entry, i) => (
            <li key={entry.stamp} className="bg-deep p-5 sm:p-6">
              <Reveal delay={i * 0.08}>
                <div className="flex items-center gap-2.5">
                  {entry.status === "active" ? (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-brass/40" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brass" />
                    </span>
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full border border-chart/50" />
                  )}
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-chart/85">
                    {entry.stamp}
                  </span>
                </div>
                <p className="mt-2.5 font-display text-lg leading-snug text-starlight">
                  {entry.title}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
