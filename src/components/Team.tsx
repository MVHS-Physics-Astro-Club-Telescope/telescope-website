"use client";

import { useInView } from "@/hooks/useInView";
import { team } from "@/data/team";
import SectionHeading from "./SectionHeading";

export default function Team() {
  const { ref, isInView } = useInView();

  return (
    <section id="team" className="relative py-24 sm:py-32 bg-[#0a0f1a]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

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
              className={`group relative p-6 rounded-2xl bg-[#0d1220] border border-white/[0.08] text-center transition-all duration-700 hover:bg-[#111827] hover:border-white/[0.14] hover:-translate-y-1 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Hover glow */}
              <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                style={{ background: `${member.color}15` }}
              />

              {/* Avatar */}
              {member.image ? (
                <div
                  className="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ border: `1px solid ${member.color}40` }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `linear-gradient(135deg, ${member.color}30, ${member.color}10)`,
                    border: `1px solid ${member.color}40`,
                  }}
                >
                  {member.initials}
                </div>
              )}

              <h3 className="text-lg font-semibold text-white mb-1">
                {member.name}
              </h3>
              <p
                className="text-sm font-medium"
                style={{ color: member.color }}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
