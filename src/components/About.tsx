"use client";

import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Hands-On Engineering",
    description:
      "We're building a 10-inch reflecting telescope from raw materials — plywood, aluminum, optics, and electronics, designed and assembled by students.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Free Star Parties",
    description:
      "Open community observation nights for families across the Bay Area. No tickets, no fees — just curiosity and clear skies.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Student-Led Software",
    description:
      "6,800+ lines of Python powering autonomous tracking, plate-solving, and auto-alignment — written and tested entirely by our team.",
  },
];

export default function About() {
  const { ref: cardsRef, isInView: cardsVisible } = useInView();

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#080B12]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="About Our Project"
          subtitle="Building a research-grade telescope from scratch — designed, engineered, and assembled entirely by high school students."
        />

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-20">
          <p className="text-lg leading-relaxed text-[rgba(240,240,250,0.7)]">
            The <span className="text-[rgba(240,240,250,1)] font-semibold">MVHS Physics &amp; Astronomy Club</span> is a
            student-run organization at Mountain View High School in Mountain View, California. Our team
            of <span className="text-[rgba(240,240,250,1)] font-semibold">7 high school students</span> is building a
            research-grade telescope entirely from scratch — covering mechanical design, optics,
            electronics, and software engineering. Our mission: bring the night sky to the Bay Area
            community through{" "}
            <span className="text-[rgba(240,240,250,1)] font-semibold">free public star parties</span>.
          </p>
        </div>

        {/* Feature Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group p-8 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-700 hover:border-white/[0.12] hover:bg-[#111922] ${
                cardsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#121A25] border border-white/[0.06] flex items-center justify-center text-white/90 mb-6">
                {feature.icon}
              </div>

              <h3 className="font-heading text-lg font-semibold text-[rgba(240,240,250,0.95)] mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-[rgba(240,240,250,0.6)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
