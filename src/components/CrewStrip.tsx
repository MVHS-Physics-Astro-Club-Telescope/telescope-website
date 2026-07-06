"use client";

import Reveal from "./Reveal";
import { team } from "@/data/team";

/** The seven of us, one compact row. */
export default function CrewStrip() {
  return (
    <section id="team" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 flex items-baseline gap-6">
            <p className="eyebrow">
              M45 · Seven sisters, seven students
            </p>
            <div className="chart-rule hidden flex-1 sm:block" aria-hidden="true" />
          </div>
        </Reveal>

        <ul className="grid grid-cols-4 gap-4 sm:grid-cols-7">
          {team.map((member, i) => (
            <Reveal key={member.name} as="li" delay={i * 0.05}>
              <div className="group text-center">
                {member.image ? (
                  <div className="relative mx-auto aspect-square w-full max-w-[6.5rem] overflow-hidden rounded-sm border border-chart/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover saturate-[0.72] transition-all duration-500 group-hover:saturate-100"
                    />
                  </div>
                ) : (
                  <div className="mx-auto flex aspect-square w-full max-w-[6.5rem] items-center justify-center rounded-sm border border-chart/15 bg-deep font-display text-xl text-chart">
                    {member.initials}
                  </div>
                )}
                <p className="mt-2.5 font-display text-sm leading-snug text-starlight">
                  {member.name}
                </p>
                <p className="mt-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-chart/75">
                  {member.role}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
