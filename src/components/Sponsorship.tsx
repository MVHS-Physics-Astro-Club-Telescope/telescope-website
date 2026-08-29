"use client";

import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SponsorButton from "./SponsorButton";
import { getBudgetRange } from "@/data/parts";

const benefits = [
  "Your name engraved on our 10-inch Dobsonian telescope",
  "Shoutout at every community star party we host",
  "Featured on our Instagram (@mvhs_physics_astro_club) and website",
  "Invitation to our First Light event in August 2026",
  "A permanent listing on our sponsors page",
];

export default function Sponsorship() {
  const { low, high } = getBudgetRange();

  return (
    <section id="support" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sponsorship · Independent, student-run, sponsor-funded"
          title="Put your name on the telescope"
          subtitle="Sponsors are engraved on the instrument itself — every star party it ever points at, your name is there."
        />

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* The ask */}
          <Reveal>
            <div>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-3xl text-starlight tabular-nums sm:text-4xl">
                  ${low.toLocaleString()}–${high.toLocaleString()}
                </span>
              </div>
              <p className="eyebrow mt-2 !text-[0.625rem]">Estimated budget</p>

              <p className="mt-7 max-w-lg leading-relaxed text-chart-bright/70">
                We build with donated materials wherever possible and keep
                costs minimal. Your sponsorship — whether $10 or $100 —
                directly funds the optics, electronics, and materials that
                make this project possible.
              </p>

              <div className="mt-9">
                <SponsorButton className="btn-brass px-8 py-3.5 text-sm">
                  Become a sponsor
                </SponsorButton>
              </div>
            </div>
          </Reveal>

          {/* The ledger of benefits */}
          <Reveal delay={0.12}>
            <div className="card-atlas tick-corners tick-corners-brass p-8">
              <h3 className="font-display text-2xl text-starlight">
                What sponsors receive
              </h3>
              <ul className="mt-6">
                {benefits.map((benefit, i) => (
                  <li
                    key={benefit}
                    className={`flex items-start gap-4 py-3.5 ${
                      i > 0 ? "border-t border-chart/12" : ""
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 font-mono text-xs text-brass"
                    >
                      ✦
                    </span>
                    <span className="text-sm leading-relaxed text-chart-bright/80">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
