"use client";

import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";

const milestones = [
  {
    date: "April 2026",
    title: "Design & Planning",
    description:
      "Finalize optical design, source the primary mirror, complete CAD models for all mechanical assemblies, and begin procurement of materials.",
    status: "current" as const,
  },
  {
    date: "May 2026",
    title: "Fabrication & Assembly",
    description:
      "Cut plywood, assemble mirror box and rocker box, machine bearing surfaces, build truss structure, and integrate electronics enclosure.",
    status: "upcoming" as const,
  },
  {
    date: "June\u2013July 2026",
    title: "Electronics & Software",
    description:
      "Wire stepper motors and drivers, integrate Raspberry Pi control system, develop tracking software, and run automated test suites.",
    status: "upcoming" as const,
  },
  {
    date: "August 2026",
    title: "First Light & Star Parties",
    description:
      "Achieve first light, calibrate optics, perform star tests, and host our inaugural free public star party for the community.",
    status: "upcoming" as const,
  },
];

export default function Timeline() {
  const { ref, isInView } = useInView();

  return (
    <section id="timeline" className="relative py-24 sm:py-32 bg-[#0a0f1a]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Project Timeline"
          subtitle="From concept to first light in under six months."
        />

        <div ref={ref} className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/50 to-transparent" />

          <div className="space-y-12">
            {milestones.map((milestone, i) => (
              <div
                key={milestone.date}
                className={`relative pl-14 sm:pl-20 transition-all duration-700 ${
                  isInView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                {/* Dot */}
                <div
                  className={`absolute left-2.5 sm:left-6.5 top-1 w-3 h-3 rounded-full border-2 ${
                    milestone.status === "current"
                      ? "bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50"
                      : "bg-transparent border-slate-600"
                  }`}
                >
                  {milestone.status === "current" && (
                    <div className="absolute -inset-1.5 rounded-full bg-blue-500/20 animate-ping" />
                  )}
                </div>

                {/* Content */}
                <div className="group p-6 sm:p-8 rounded-2xl bg-[#0d1220] border border-white/[0.08] transition-all duration-300 hover:bg-[#111827] hover:border-white/[0.14]">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-sm font-mono font-medium px-3 py-1 rounded-full ${
                        milestone.status === "current"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-white/5 text-slate-500 border border-white/5"
                      }`}
                    >
                      {milestone.date}
                    </span>
                    {milestone.status === "current" && (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
