"use client";

import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "STEM Education",
    description: "Hands-on experience in mechanical engineering, optics, electronics, and software development \u2014 learning by building.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Community Outreach",
    description: "Free public star parties for the Bay Area community. No tickets, no fees \u2014 just curiosity and a love for the cosmos.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Inspiring Youth",
    description: "Showing the next generation of students that they can design, engineer, and build anything they set their minds to.",
  },
];

export default function About() {
  const { ref: cardsRef, isInView: cardsVisible } = useInView();

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#030712]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="About Our Project"
          subtitle="Building a research-grade telescope from scratch \u2014 designed, engineered, and assembled entirely by high school students."
        />

        <div className="max-w-3xl mx-auto mb-20">
          <div className="relative p-8 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
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

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm transition-all duration-700 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-1 ${
                cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
