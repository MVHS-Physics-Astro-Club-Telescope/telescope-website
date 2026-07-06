"use client";

import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type EntryStatus = "logged" | "active" | "scheduled";

const entries: {
  stamp: string;
  title: string;
  description: string;
  status: EntryStatus;
}[] = [
  {
    stamp: "2026-04 · APR",
    title: "Design & planning",
    description:
      "Finalize optical design, source the primary mirror, complete CAD models for all mechanical assemblies, and begin procurement of materials.",
    status: "active",
  },
  {
    stamp: "2026-05 · MAY",
    title: "Fabrication & assembly",
    description:
      "Cut plywood, assemble mirror box and rocker box, machine bearing surfaces, build truss structure, and integrate electronics enclosure.",
    status: "scheduled",
  },
  {
    stamp: "2026-06/07 · JUN–JUL",
    title: "Electronics & software",
    description:
      "Wire stepper motors and drivers, integrate Raspberry Pi control system, develop tracking software, and run automated test suites.",
    status: "scheduled",
  },
  {
    stamp: "2026-08 · AUG",
    title: "First light & star parties",
    description:
      "Achieve first light, calibrate optics, perform star tests, and host our inaugural free public star party for the community.",
    status: "scheduled",
  },
];

function StatusMark({ status }: { status: EntryStatus }) {
  if (status === "active") {
    return (
      <span className="relative flex h-3 w-3">
        <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-brass/40" />
        <span className="relative inline-flex h-3 w-3 rounded-full border border-brass-bright bg-brass" />
      </span>
    );
  }
  if (status === "logged") {
    return <span className="h-3 w-3 rounded-full bg-oiii" />;
  }
  return (
    <span className="h-3 w-3 rounded-full border border-chart/50 bg-transparent" />
  );
}

export default function Timeline() {
  return (
    <section id="timeline" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Observing log · 2026 April — August"
          title="From plywood to first light"
          subtitle="Concept to a working public observatory in under six months."
        />

        <div className="relative mx-auto max-w-3xl">
          {/* The log's meridian line */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-chart/10 via-chart/30 to-chart/10"
          />

          <ol className="space-y-12">
            {entries.map((entry, i) => (
              <Reveal key={entry.stamp} as="li" delay={i * 0.1}>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1">
                    <StatusMark status={entry.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chart/85">
                      {entry.stamp}
                    </span>
                    {entry.status === "active" && (
                      <span className="rounded-sm border border-brass/35 bg-brass/10 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brass-bright">
                        In progress
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2.5 font-display text-2xl text-starlight">
                    {entry.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-chart-bright/65">
                    {entry.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
