import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SponsorButton from "@/components/SponsorButton";
import { sponsors, getTotalRaised, getCashSponsorCount, getInKindSponsorCount } from "@/data/sponsors";

export const metadata: Metadata = {
  title: "Our Sponsors — MVHS Astronomy Telescope Project",
  description:
    "Thank you to the organizations supporting our student-built autonomous telescope. Interested in sponsoring? Get in touch.",
};

const TYPE_LABELS = {
  Cash: "Cash sponsor",
  Equipment: "Equipment donor",
  Service: "Service partner",
  Materials: "Materials partner",
} as const;

const TYPE_ACCENT = {
  Cash: "text-[#30D158]",
  Equipment: "text-[#0A84FF]",
  Service: "text-[#5AC8FA]",
  Materials: "text-[#FF9F0A]",
} as const;

function SponsorCard({ sponsor }: { sponsor: (typeof sponsors)[number] }) {
  const cardClasses =
    "group p-8 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300 flex flex-col items-center text-center h-full";

  const inner = (
    <>
      {sponsor.logo ? (
        <div className="w-full h-20 flex items-center justify-center mb-6">
          <Image
            src={sponsor.logo}
            alt={`${sponsor.name} logo`}
            width={200}
            height={60}
            className="max-h-16 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-20 flex items-center justify-center mb-6">
          <div className="font-heading text-2xl font-bold text-[rgba(240,240,250,0.85)] tracking-tight px-4 text-center">
            {sponsor.name}
          </div>
        </div>
      )}
      <span
        className={`text-[10px] uppercase tracking-[0.2em] font-medium mb-2 ${TYPE_ACCENT[sponsor.type]}`}
      >
        {TYPE_LABELS[sponsor.type]}
      </span>
      <h3 className="font-heading text-lg font-semibold text-[rgba(240,240,250,0.95)] mb-1">
        {sponsor.name}
      </h3>
      <p className="text-xs font-medium text-[rgba(240,240,250,0.6)] mb-3 tabular-nums">
        {sponsor.contribution}
      </p>
      <p className="text-sm text-[rgba(240,240,250,0.5)] leading-relaxed flex-1">
        {sponsor.description}
      </p>
      {sponsor.url && (
        <span className="mt-4 text-xs text-[rgba(240,240,250,0.4)] group-hover:text-[rgba(240,240,250,0.7)] transition-colors duration-200">
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
  const totalRaised = getTotalRaised();
  const cashCount = getCashSponsorCount();
  const inKindCount = getInKindSponsorCount();

  return (
    <section className="relative min-h-screen bg-[#080B12] pt-28 sm:pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[rgba(240,240,250,0.4)] mb-8">
          <Link
            href="/"
            className="hover:text-[rgba(240,240,250,0.8)] transition-colors duration-200"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-[rgba(240,240,250,0.7)]">Sponsors</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-6" />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[rgba(240,240,250,1)]">
            Our Sponsors
          </h1>
          <p className="text-[rgba(240,240,250,0.6)] text-lg mt-4 max-w-2xl mx-auto">
            This project wouldn&apos;t be possible without the generous support of
            these organizations. Thank you for helping us bring the night sky to
            the Bay Area community.
          </p>
        </div>

        {/* Quick stats strip */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-16 p-6 sm:p-8 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="text-center">
            <div className="font-heading text-3xl sm:text-4xl font-bold text-[#30D158] tabular-nums">
              ${totalRaised.toLocaleString()}
            </div>
            <div className="mt-2 text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
              Cash raised
            </div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl sm:text-4xl font-bold text-[rgba(240,240,250,1)] tabular-nums">
              {cashCount}
            </div>
            <div className="mt-2 text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
              Cash sponsors
            </div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl sm:text-4xl font-bold text-[rgba(240,240,250,1)] tabular-nums">
              {inKindCount}
            </div>
            <div className="mt-2 text-xs uppercase tracking-wider text-[rgba(240,240,250,0.4)]">
              In-kind sponsors
            </div>
          </div>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.name} sponsor={sponsor} />
          ))}
        </div>

        {/* Interested in Sponsoring CTA */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-[#111922] transition-all duration-300 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[rgba(240,240,250,1)] mb-3">
            Interested in Sponsoring?
          </h2>
          <p className="text-[rgba(240,240,250,0.6)] mb-8 max-w-xl mx-auto">
            We&apos;re always looking for partners who believe in STEM education and
            community astronomy. Whether it&apos;s financial support, in-kind
            donations, or materials, every contribution helps us build something
            extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SponsorButton>
              Get in Touch
            </SponsorButton>
            <Link
              href="/#fundraising"
              className="btn-titanium-dark px-8 py-3 text-sm font-medium text-[rgba(240,240,250,0.9)] rounded-full"
            >
              See progress
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
