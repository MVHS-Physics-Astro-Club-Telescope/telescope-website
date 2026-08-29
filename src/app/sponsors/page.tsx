import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ImmersiveHero from "@/components/ImmersiveHero";
import Reveal from "@/components/Reveal";
import SponsorButton from "@/components/SponsorButton";
import SponsorConstellation from "@/components/SponsorConstellation";
import StatCounter from "@/components/StatCounter";
import {
  sponsors,
  getTotalCashRaised,
  getCashSponsorCount,
  getInKindSponsorCount,
  getSponsorsByType,
  type Sponsor,
  type SponsorType,
} from "@/data/sponsors";

export const metadata: Metadata = {
  title: "Our Sponsors — MV Astronomy Telescope Project",
  description:
    "Thank you to the organizations supporting our student-built autonomous telescope. Interested in sponsoring? Get in touch.",
};

const GROUPS: { type: SponsorType; heading: string }[] = [
  { type: "Cash", heading: "Cash sponsors" },
  { type: "Equipment", heading: "Equipment donors" },
  { type: "Materials", heading: "Materials partners" },
  { type: "Service", heading: "Service partners" },
];

function SponsorCard({ sponsor, plate }: { sponsor: Sponsor; plate: number }) {
  const cardClasses =
    "card-atlas tick-corners group flex h-full flex-col p-7 transition-colors duration-300 hover:border-chart/30 hover:bg-raised/40";

  const inner = (
    <>
      {/* Plate header: catalog number + engraved type chip */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.625rem] tracking-[0.18em] text-chart-bright/45 tabular-nums">
          PL. {String(plate).padStart(2, "0")}
        </span>
        <span className="rounded-[2px] border border-chart/20 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-chart-bright/70">
          {sponsor.type}
        </span>
      </div>

      {/* Logo or serif wordmark */}
      <div className="mt-6 flex min-h-16 items-center">
        {sponsor.logo ? (
          <Image
            src={sponsor.logo}
            alt={`${sponsor.name} logo`}
            width={200}
            height={60}
            className="max-h-14 w-auto object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : (
          <h3 className="font-display text-2xl leading-tight text-starlight">
            {sponsor.name}
          </h3>
        )}
      </div>

      {sponsor.logo && (
        <h3 className="mt-5 text-base font-medium text-starlight">
          {sponsor.name}
        </h3>
      )}
      <p
        className={`font-mono text-xs text-brass-bright tabular-nums ${
          sponsor.logo ? "mt-1.5" : "mt-3"
        }`}
      >
        {sponsor.contribution}
      </p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-chart-bright/65">
        {sponsor.description}
      </p>
      {sponsor.url && (
        <span className="mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-chart-bright/50 transition-colors duration-200 group-hover:text-brass-bright">
          Visit website &rarr;
        </span>
      )}
    </>
  );

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${sponsor.name} website`}
        className={cardClasses}
      >
        {inner}
      </a>
    );
  }
  return <div className={cardClasses}>{inner}</div>;
}

export default function SponsorsPage() {
  const totalRaised = getTotalCashRaised();
  const cashCount = getCashSponsorCount();
  const inKindCount = getInKindSponsorCount();

  // Plate numbers run continuously across the grouped register
  const grouped = GROUPS.map(({ type, heading }) => ({
    type,
    heading,
    items: getSponsorsByType(type),
  })).filter((g) => g.items.length > 0);
  const groups = grouped.map((g, gi) => ({
    ...g,
    start: grouped
      .slice(0, gi)
      .reduce((sum, prev) => sum + prev.items.length, 0),
  }));

  return (
    <>
      <ImmersiveHero starCount={60} className="pt-28 sm:pt-32 pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-chart-bright/45"
          >
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-brass-bright"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-chart-bright/75">Sponsors</span>
          </nav>

          {/* Page header */}
          <div className="text-center">
            <p className="eyebrow">
              Sponsor register · {String(sponsors.length).padStart(2, "0")}{" "}
              partners
            </p>
            <h1 className="mt-5 font-display text-4xl leading-tight text-starlight sm:text-5xl md:text-6xl">
              The names behind the <em>light</em>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-chart-bright/70 sm:text-lg">
              This project wouldn&apos;t be possible without the generous
              support of these organizations. Thank you for helping us bring
              the night sky to the Bay Area community.
            </p>
            <p className="mt-6 font-mono text-sm text-brass-bright tabular-nums">
              ${totalRaised.toLocaleString()} cash raised · {inKindCount}{" "}
              in-kind contributions
            </p>
          </div>
        </div>

        {/* Constellation band — one star per sponsor */}
        <SponsorConstellation sponsorCount={sponsors.length} />
      </ImmersiveHero>

      <section className="relative bg-void pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Register ledger — quick stats */}
          <Reveal className="mt-12 mb-16 sm:mt-16">
            <div className="card-atlas tick-corners grid grid-cols-3 divide-x divide-chart/12 p-6 sm:p-8">
              <StatCounter
                value={totalRaised}
                prefix="$"
                label="Cash raised"
                highlight
              />
              <StatCounter value={cashCount} label="Cash sponsors" />
              <StatCounter value={inKindCount} label="In-kind sponsors" />
            </div>
          </Reveal>

          {/* The register, grouped by contribution type */}
          {groups.map(({ type, heading, items, start }) => (
            <div key={type} className="mb-16">
              <div className="mb-8 flex items-baseline gap-6">
                <h2 className="eyebrow">
                  {heading} · {String(items.length).padStart(2, "0")}
                </h2>
                <div className="chart-rule flex-1" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((sponsor, i) => (
                  <Reveal
                    key={sponsor.name}
                    delay={i * 0.06}
                    className="h-full"
                  >
                    <SponsorCard sponsor={sponsor} plate={start + i + 1} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}

          {/* Become-a-sponsor CTA */}
          <Reveal>
            <div className="card-atlas tick-corners tick-corners-brass p-8 text-center sm:p-12">
              <p className="eyebrow">Join the register</p>
              <h2 className="mt-4 font-display text-3xl text-starlight sm:text-4xl">
                Interested in <em>sponsoring</em>?
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-chart-bright/70">
                We&apos;re always looking for partners who believe in STEM
                education and community astronomy. Whether it&apos;s financial
                support, in-kind donations, or materials, every contribution
                helps us build something extraordinary.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <SponsorButton className="btn-brass px-8 py-3.5 text-sm">
                  Get in touch
                </SponsorButton>
                <Link
                  href="/#fundraising"
                  className="btn-line px-8 py-3.5 text-sm"
                >
                  See funding progress
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
