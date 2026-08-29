"use client";

import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { team, leadershipNote } from "@/data/team";

export default function Team() {
  return (
    <section id="team" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="M45 · The Pleiades — seven sisters, seven students"
          title="The crew"
          subtitle="Mechanical, optical, electronic, and software — every discipline on this build is run by a student."
        />

        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {team.map((member, i) => (
            <Reveal key={member.name} as="li" delay={i * 0.07}>
              <div className="card-atlas group h-full overflow-hidden transition-colors duration-300 hover:border-brass/40">
                {member.image ? (
                  <div className="relative aspect-square overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover saturate-[0.72] transition-all duration-500 group-hover:scale-[1.03] group-hover:saturate-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-panel/60 to-transparent" />
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-deep font-display text-3xl text-chart">
                    {member.initials}
                  </div>
                )}
                <div className="p-4 sm:p-5">
                  <h3 className="font-display text-lg leading-snug text-starlight">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-chart/80">
                    {member.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="card-atlas tick-corners mt-10 max-w-3xl p-6 sm:p-7">
            <p className="eyebrow !text-[0.625rem] text-chart/70">
              {leadershipNote.heading}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-chart-bright/65">
              {leadershipNote.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
