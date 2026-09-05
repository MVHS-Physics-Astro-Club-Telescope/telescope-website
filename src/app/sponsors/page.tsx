import type { Metadata } from "next";
import {
  getSponsorsByType,
  getTotalCashRaised,
  sponsorGroups,
  sponsors,
  type Sponsor,
} from "@/data/sponsors";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "The organisations backing the MV Astronomy telescope with cash, equipment, fabrication, and services.",
};

function SponsorRow({ sponsor }: { sponsor: Sponsor }) {
  const inner = (
    <>
      <div className="flex h-8 items-center">
        {sponsor.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            loading="lazy"
            decoding="async"
            className="logo-mono h-7 w-auto max-w-[9.5rem] object-contain object-left"
          />
        ) : (
          <span className="text-[1.0625rem] text-ink">{sponsor.name}</span>
        )}
      </div>
      <p className="text-[0.9375rem] text-ink-2 sm:text-right">{sponsor.contribution}</p>
    </>
  );
  const cls =
    "row grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:items-center sm:gap-8";
  return sponsor.url ? (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${sponsor.name}: ${sponsor.contribution}`}
      className={`${cls} group`}
    >
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export default function SponsorsPage() {
  const raised = getTotalCashRaised();
  const groups = sponsorGroups
    .map((g) => ({ ...g, items: getSponsorsByType(g.type) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40">
      <p className="label">Sponsors</p>
      <h1 className="font-display mt-3 max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
        {sponsors.length} sponsors behind the light.
      </h1>
      <p className="prose-tight mt-5 text-lg">
        ${raised.toLocaleString()} in cash, the primary mirror, the cameras,
        the power system, and the fabrication credit that turns drawings into
        parts.
      </p>

      <div className="mt-16 space-y-14">
        {groups.map((g) => (
          <section key={g.type} aria-labelledby={`group-${g.type}`}>
            <h2 id={`group-${g.type}`} className="label mb-2">
              {g.heading}
            </h2>
            <div>
              {g.items.map((s) => (
                <SponsorRow key={s.name} sponsor={s} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-24 max-w-xl">
        <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.4rem)] text-ink">
          Add your name.
        </h2>
        <p className="prose-tight mt-3">
          Cash, parts, fabrication, or a place to observe from. Every sponsor
          is engraved on the instrument and listed here for good.
        </p>
        <a
          href="mailto:mvhsphysicsastroclub@gmail.com?subject=Telescope%20sponsorship"
          className="btn btn-solid mt-7"
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}
