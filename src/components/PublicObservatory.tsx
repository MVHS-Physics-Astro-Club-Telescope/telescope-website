"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";

/**
 * Homepage section introducing the Public Observatory feature: the live view
 * and the target request form. Both pages are in "Coming Soon" preview mode.
 *
 * Layout: section heading → two CTA cards side-by-side at md+ widths,
 * stacked on mobile. Cards use the same dark-titanium surface as the rest
 * of the homepage components (About, Sponsorship).
 */
export default function PublicObservatory() {
  const { ref, isInView } = useInView();

  const cards = [
    {
      eyebrow: "Live View",
      title: "Watch the telescope work",
      description:
        "Real-time tracking, exposures, and sky conditions streamed straight from the observatory floor.",
      cta: "Watch live view",
      href: "/observe",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 11l9-3 2 4.5L5 16z" />
          <path d="M14 12.5l4-1.4" />
          <path d="M9 14l3 7" />
          <path d="M12 14l-3 7" />
          <circle cx="19" cy="9" r="2" />
        </svg>
      ),
    },
    {
      eyebrow: "Target Requests",
      title: "Tell it what to capture",
      description:
        "Pick a galaxy, nebula, or planet. We point the telescope at it and email you the image.",
      cta: "Request a target",
      href: "/request",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="observatory"
      className="relative py-24 sm:py-32 bg-[#080B12]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="A telescope you can use, from anywhere"
          subtitle="We're building a public-access robotic observatory. Submit a target, get an image of the cosmos — for free, from your phone."
        />

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {cards.map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative p-8 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.16] hover:bg-[#111922] transition-all duration-500 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* "Coming Soon" pill — top right */}
              <span className="absolute top-5 right-5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#9DC4FF] bg-[#0A84FF]/10 border border-[#0A84FF]/25 rounded-full px-2.5 py-1">
                Coming Soon
              </span>

              <div className="w-11 h-11 rounded-xl bg-[#121A25] border border-white/[0.06] flex items-center justify-center text-white/90 mb-6">
                {card.icon}
              </div>

              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[rgba(240,240,250,0.45)]">
                {card.eyebrow}
              </span>
              <h3 className="font-heading text-2xl font-semibold text-[rgba(240,240,250,0.97)] mt-2 mb-3">
                {card.title}
              </h3>
              <p className="text-[15px] text-[rgba(240,240,250,0.65)] leading-relaxed mb-6">
                {card.description}
              </p>

              <span className="inline-flex items-center gap-2 text-sm font-medium text-[rgba(240,240,250,0.95)] group-hover:gap-3 transition-all">
                {card.cta}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
