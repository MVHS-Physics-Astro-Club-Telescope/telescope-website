"use client";

import Link from "next/link";
import Reveal from "./Reveal";

const cards = [
  {
    title: "Watch the telescope work",
    description: "Live tracking, exposures, and sky conditions.",
    href: "/observe",
  },
  {
    title: "Tell it what to capture",
    description: "Pick a target; the image lands in your inbox.",
    href: "/request",
  },
];

/** Compact gateway to the two observatory preview pages. */
export default function ObservatoryStrip() {
  return (
    <section id="observatory" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.1}>
              <Link
                href={card.href}
                className="card-atlas tick-corners group relative flex h-full items-center justify-between gap-6 p-6 transition-colors duration-300 hover:border-brass/40 sm:p-7"
              >
                <div>
                  <span className="absolute right-5 top-5 rounded-sm border border-brass/30 bg-brass/10 px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-brass-bright">
                    Coming soon
                  </span>
                  <h3 className="max-w-[14ch] font-display text-2xl text-starlight">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-chart-bright/65">
                    {card.description}
                  </p>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0 text-brass-bright transition-transform group-hover:translate-x-1.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
