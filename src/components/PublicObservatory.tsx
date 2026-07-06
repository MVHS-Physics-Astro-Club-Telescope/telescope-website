"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * The public-observatory pipeline. The numbered steps are a true
 * sequence — a request really does move through them in this order.
 */
const pipeline = [
  {
    step: "01",
    title: "You pick a target",
    description:
      "A galaxy, a nebula, a planet — anything in our catalog, from any phone or laptop.",
  },
  {
    step: "02",
    title: "The telescope slews",
    description:
      "The mount finds your object, plate-solves to confirm it's centered, and starts the exposure.",
  },
  {
    step: "03",
    title: "The image comes back",
    description:
      "Your photograph of the cosmos lands in your inbox. Free, every time.",
  },
];

const cards = [
  {
    eyebrow: "Live view",
    title: "Watch the telescope work",
    description:
      "Real-time tracking, exposures, and sky conditions streamed straight from the observatory floor.",
    cta: "Watch live view",
    href: "/observe",
  },
  {
    eyebrow: "Target requests",
    title: "Tell it what to capture",
    description:
      "Pick a galaxy, nebula, or planet. We point the telescope at it and email you the image.",
    cta: "Request a target",
    href: "/request",
  },
];

export default function PublicObservatory() {
  return (
    <section id="observatory" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Public observatory · Remote access"
          title="A telescope you can use from anywhere"
          subtitle="We're building a public-access robotic observatory. Submit a target, get an image of the cosmos — for free, from your phone."
        />

        {/* The pipeline */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded border border-chart/15 bg-chart/15 sm:grid-cols-3">
          {pipeline.map((p, i) => (
            <div key={p.step} className="bg-deep p-7 sm:p-8">
              <Reveal delay={i * 0.12}>
                <p className="font-mono text-xs tracking-[0.2em] text-brass">
                  {p.step}
                </p>
                <h3 className="mt-4 font-display text-xl text-starlight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-chart-bright/65">
                  {p.description}
                </p>
              </Reveal>
            </div>
          ))}
        </div>

        {/* Preview pages */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.12}>
              <Link
                href={card.href}
                className="card-atlas tick-corners group relative block h-full p-8 transition-colors duration-300 hover:border-brass/40"
              >
                <span className="absolute right-6 top-6 rounded-sm border border-brass/30 bg-brass/10 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brass-bright">
                  Coming soon
                </span>

                <p className="eyebrow !text-[0.625rem]">{card.eyebrow}</p>
                <h3 className="mt-3 max-w-[16ch] font-display text-2xl text-starlight">
                  {card.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-chart-bright/65">
                  {card.description}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-brass-bright transition-all group-hover:gap-3.5">
                  {card.cta}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
