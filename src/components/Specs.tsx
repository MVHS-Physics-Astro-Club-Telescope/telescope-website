"use client";

import { useInView } from "@/hooks/useInView";
import AnimatedCounter from "./AnimatedCounter";
import SectionHeading from "./SectionHeading";

const stats = [
  { end: 10, suffix: '"', label: "Mirror Diameter", prefix: "" },
  { end: 1138, suffix: "mm", label: "Focal Length", prefix: "" },
  { end: 4.48, suffix: "", label: "Focal Ratio", prefix: "f/", decimals: 2 },
  { end: 6800, suffix: "+", label: "Lines of Code", prefix: "" },
  { end: 328, suffix: "", label: "Tests Passing", prefix: "" },
];

const bentoItems = [
  {
    title: "Primary Mirror",
    desc: '10" f/4.48 parabolic mirror \u2014 the optical heart of the system',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    span: "md:col-span-2",
  },
  {
    title: "Star Tracking",
    desc: "INDI-compatible GoTo with plate-solving and auto-alignment",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="12" x2="18" y2="12" />
        <line x1="6" y1="12" x2="2" y2="12" />
        <line x1="12" y1="6" x2="12" y2="2" />
        <line x1="12" y1="22" x2="12" y2="18" />
      </svg>
    ),
    span: "",
  },
  {
    title: "Stepper Motors",
    desc: "NEMA 23 altitude/azimuth + NEMA 17 focus with TMC2209 silent drivers",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    span: "",
  },
  {
    title: "Software Stack",
    desc: "Python + TypeScript control system with web dashboard, ASCOM/INDI drivers",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    span: "md:col-span-2",
  },
  {
    title: "Dobsonian Build",
    desc: "Truss-tube Dobsonian design for optimal portability and rigidity",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M12 6V2M7 6V4M17 6V4" />
      </svg>
    ),
    span: "",
  },
  {
    title: "Portable Design",
    desc: "Breaks down into two sections \u2014 fits in a car trunk for field trips",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
      </svg>
    ),
    span: "",
  },
  {
    title: "Weight Target",
    desc: "Under 50 lbs total \u2014 manageable by a single student",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11l1 12H5.5z" />
        <path d="M9 6.5V4a3 3 0 0 1 6 0v2.5" />
      </svg>
    ),
    span: "",
  },
  {
    title: "Imaging Camera",
    desc: "ZWO ASI120MC-S for planetary and deep-sky astrophotography",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    span: "",
  },
];

export default function Specs() {
  const { ref: bentoRef, isInView: bentoVisible } = useInView();

  return (
    <section id="specs" className="relative py-24 sm:py-32 bg-[#030712]">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Technical Specifications"
          subtitle="Engineered for performance \u2014 every component carefully selected and tested."
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-20">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              end={stat.end}
              prefix={stat.prefix}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals}
            />
          ))}
        </div>

        {/* Bento Grid */}
        <div
          ref={bentoRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {bentoItems.map((item, i) => (
            <div
              key={item.title}
              className={`group relative p-6 lg:p-8 rounded-2xl bg-[#0a0f1a] border border-white/[0.08] transition-all duration-700 hover:bg-[#0d1220] hover:border-white/[0.14] hover:-translate-y-0.5 ${
                item.span
              } ${
                bentoVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-blue-400 mb-4 group-hover:text-violet-400 transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
