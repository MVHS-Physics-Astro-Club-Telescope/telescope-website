"use client";

import { useInView } from "@/hooks/useInView";
import { team } from "@/data/team";
import SectionHeading from "./SectionHeading";

export default function Team() {
  const { ref, isInView } = useInView();

  return (
    <section id="team" className="relative py-24 sm:py-32 bg-[#080B12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Meet Our Team"
          subtitle="Seven students with a shared passion for astronomy and engineering."
        />

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {team.map((member, i) => (
            <div
              key={member.name}
              className={`group p-6 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all duration-700 hover:border-white/[0.12] hover:bg-[#111922] hover:-translate-y-0.5 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Avatar */}
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 border border-white/[0.08]"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#121A25] text-[rgba(240,240,250,0.5)] flex items-center justify-center text-lg font-semibold mx-auto mb-4 border border-white/[0.08]">
                  {member.initials}
                </div>
              )}

              <h3 className="font-heading text-base font-medium text-[rgba(240,240,250,0.95)] mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-[rgba(240,240,250,0.5)]">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
