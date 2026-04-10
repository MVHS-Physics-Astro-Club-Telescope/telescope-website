"use client";

import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";

type MilestoneStatus = "completed" | "current" | "upcoming";

const milestones: { date: string; title: string; description: string; status: MilestoneStatus }[] = [
  {
    date: "April 2026",
    title: "Design & Planning",
    description:
      "Finalize optical design, source the primary mirror, complete CAD models for all mechanical assemblies, and begin procurement of materials.",
    status: "current" ,
  },
  {
    date: "May 2026",
    title: "Fabrication & Assembly",
    description:
      "Cut plywood, assemble mirror box and rocker box, machine bearing surfaces, build truss structure, and integrate electronics enclosure.",
    status: "upcoming" ,
  },
  {
    date: "June\u2013July 2026",
    title: "Electronics & Software",
    description:
      "Wire stepper motors and drivers, integrate Raspberry Pi control system, develop tracking software, and run automated test suites.",
    status: "upcoming" ,
  },
  {
    date: "August 2026",
    title: "First Light & Star Parties",
    description:
      "Achieve first light, calibrate optics, perform star tests, and host our inaugural free public star party for the community.",
    status: "upcoming" ,
  },
];

export default function Timeline() {
  const { ref, isInView } = useInView();

  return (
    <section id="timeline" className="relative py-24 sm:py-32 bg-[#080B12]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Project Timeline"
          subtitle="From concept to first light in under six months."
        />

        <div ref={ref} className="relative">
          {/* Vertical line — gradient fades at edges */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-white/[0.06] via-white/[0.12] to-white/[0.06]" />

          <div className="space-y-14">
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
                {/* Phase dot */}
                {milestone.status === "current" ? (
                  <div className="absolute top-1 left-[9px] sm:left-[25px] w-3 h-3 rounded-full bg-[#0A84FF] ring-4 ring-[#0A84FF]/20" />
                ) : milestone.status === "completed" ? (
                  <div className="absolute top-1 left-[9px] sm:left-[25px] w-3 h-3 rounded-full bg-[#30D158] ring-4 ring-[#30D158]/20" />
                ) : (
                  <div className="absolute top-1.5 left-[11px] sm:left-[27px] w-2.5 h-2.5 rounded-full bg-[rgba(240,240,250,0.5)]" />
                )}

                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-heading uppercase tracking-[0.15em] text-[rgba(240,240,250,0.4)]">
                      {milestone.date}
                    </span>
                    {milestone.status === "current" && (
                      <span className="bg-[#0A84FF]/10 border border-[#0A84FF]/20 rounded-full px-3 py-1 text-xs text-[#0A84FF]">
                        In Progress
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-[rgba(240,240,250,0.95)] mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-[rgba(240,240,250,0.6)] leading-relaxed">
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
