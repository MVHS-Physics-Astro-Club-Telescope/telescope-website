"use client";

import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Hands-On Engineering",
    description:
      "We're building a 10-inch reflecting telescope from raw materials \u2014 plywood, aluminum, optics, and electronics, designed and assembled by students.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Free Star Parties",
    description:
      "Open community observation nights for families across the Bay Area. No tickets, no fees \u2014 just curiosity and clear skies.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Student-Led Software",
    description:
      "6,800+ lines of Python powering autonomous tracking, plate-solving, and auto-alignment \u2014 written and tested entirely by our team.",
  },
];

export default function About() {
  const { ref: cardsRef, isInView: cardsVisible } = useInView();

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#030712]">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="About Our Project"
          subtitle="Building a research-grade telescope from scratch \u2014 designed, engineered, and assembled entirely by high school students."
        />

        {/* Mission Statement */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="relative p-8 sm:p-10 rounded-2xl bg-[#0a0f1a] border border-white/[0.08]">
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <p className="text-slate-300 text-lg leading-relaxed">
              The <span className="text-white font-semibold">MVHS Physics &amp; Astronomy Club</span> is a
              student-run organization at Mountain View High School in Mountain View, California. Our team
              of <span className="text-blue-400 font-semibold">7 high school students</span> is building a
              research-grade telescope entirely from scratch \u2014 covering mechanical design, optics,
              electronics, and software engineering. Our mission: bring the night sky to the Bay Area
              community through{" "}
              <span className="text-violet-400 font-semibold">free public star parties</span>.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative p-8 rounded-2xl bg-[#0a0f1a] border border-white/[0.08] transition-all duration-700 hover:bg-[#0d1220] hover:border-white/[0.14] hover:-translate-y-1 ${
                cardsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Top glow line */}
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
