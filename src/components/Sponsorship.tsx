"use client";

import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";
import SponsorButton from "./SponsorButton";

const benefits = [
  "Your name engraved on our 10-inch Dobsonian telescope",
  "Shoutout at every community star party we host",
  "Featured on our Instagram (@mvhs_physics_astro_club) and website",
  "Invitation to our First Light event in August 2026",
  "Tax-deductible donation through our school district",
];

export default function Sponsorship() {
  const { ref, isInView } = useInView();

  return (
    <section id="support" className="relative py-24 sm:py-32 bg-[#080B12]">
      {/* Subtle moonlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(147,197,253,0.02),transparent)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Support Our Mission"
          subtitle="Help us bring the night sky to the Bay Area community."
        />

        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Left: Budget Info */}
          <div>
            <h3 className="font-heading text-3xl font-bold text-[rgba(240,240,250,1)] mb-2">
              $1,706&ndash;$2,593
            </h3>
            <p className="text-sm font-heading uppercase tracking-[0.15em] text-[rgba(240,240,250,0.4)] mb-6">
              Estimated Budget
            </p>

            <p className="text-[rgba(240,240,250,0.6)] leading-relaxed mb-8">
              We&apos;re building this telescope with donated materials wherever possible and
              keeping costs minimal. Your sponsorship &mdash; whether $10 or $100 &mdash; directly
              funds the optics, electronics, and materials that make this project possible.
            </p>

            <SponsorButton>
              Become a Sponsor
            </SponsorButton>
          </div>

          {/* Right: Benefits — titanium card */}
          <div className="bg-[#0D1219] border border-white/[0.08] rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300 p-8">
            <h4 className="font-heading text-xl font-semibold text-[rgba(240,240,250,0.95)] mb-6">
              Sponsor Benefits
            </h4>
            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 transition-all duration-500 ${
                    isInView
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <svg
                    className="w-4 h-4 text-[#30D158] mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm text-[rgba(240,240,250,0.7)]">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
