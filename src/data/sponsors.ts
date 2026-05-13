export type SponsorType = "Cash" | "Equipment" | "Service" | "Materials";

export interface Sponsor {
  name: string;
  /** Path to logo file in /public/sponsors/. Only set if we have an actual,
   *  usable logo file (verified). Otherwise the card renders with a clean
   *  text wordmark. */
  logo?: string;
  /** Homepage URL for the sponsor. */
  url?: string;
  /** Optional direct product link (for outreach donors whose donation is a
   *  specific product we can point visitors to — e.g. Unistellar, DWARFLAB,
   *  Thames & Kosmos). Distinct from `url`, which is the homepage. */
  productUrl?: string;
  description: string;
  type: SponsorType;
  /** Direct cash given to the project. Only Cash-type sponsors have non-zero
   *  values here. Service credits, equipment, vouchers, and store credits
   *  are NOT counted toward cash totals — they're tracked as in-kind. */
  cashValue: number;
  /** Display string for the contribution (e.g. "$500 fabrication credit",
   *  "DWARF mini telescope"). */
  contribution: string;
  /** True when this sponsor's contribution materially reduces the build cost
   *  (parts/credits going onto OUR 10" Dobsonian). False for outreach-only
   *  donations like Unistellar/DWARF smart telescopes that we use at star
   *  parties but don't install on the build. */
  appliesToBuild: boolean;
  /** Retail dollar value of the in-kind contribution as it counts toward the
   *  build budget. Only set when appliesToBuild is true and type !== "Cash".
   *  This drives the "saved by sponsorship" headline on FundraisingProgress. */
  estimatedRetailValue?: number;
}

export const sponsors: Sponsor[] = [
  // ── CASH SPONSORS ──────────────────────────────────────────────────────
  {
    name: "Crave Yoga",
    url: "https://craveyoga-mv.com",
    description:
      "Mountain View community yoga studio. Helena McLoughlin and Crave Yoga pledged a $250 cash donation to the project via our sponsor form — check pending delivery.",
    type: "Cash",
    cashValue: 250,
    contribution: "$250 cash donation",
    appliesToBuild: true,
  },
  {
    name: "Tori Atwell — The Agency RE",
    url: "https://www.theagencyre.com/agent/tori-atwell/",
    description:
      "Bay Area real estate broker-associate at The Agency. Tori supported the project with a $100 cash donation, received April 2026.",
    type: "Cash",
    cashValue: 100,
    contribution: "$100 cash donation",
    appliesToBuild: true,
  },
  {
    name: "Deep Sky West",
    url: "https://www.deepskywest.com",
    description:
      "Remote astrophotography observatory in Rowe, NM. Lloyd Smith confirmed a monetary donation to the project (amount pending) and is offering free astrophotography classes to our club members.",
    type: "Cash",
    cashValue: 0,
    contribution: "Monetary donation + free astrophotography classes",
    appliesToBuild: true,
  },

  // ── EQUIPMENT DONORS — BUILD ───────────────────────────────────────────
  {
    name: "Pacific Holographic",
    logo: "/sponsors/pacific-holographics.png",
    url: "http://pacholo.com",
    description:
      "Pacific Holographic specializes in precision holographic optical elements. They donated the 254mm (10\") f/4.48 parabolic primary mirror that anchors our entire optical design.",
    type: "Equipment",
    cashValue: 0,
    contribution: "254mm primary mirror",
    appliesToBuild: true,
    estimatedRetailValue: 1350,
  },
  {
    name: "SendCutSend",
    logo: "/sponsors/sendcutsend.svg",
    url: "https://sendcutsend.com",
    description:
      "Online laser cutting, waterjet cutting, and metal fabrication. SendCutSend issued a $500 fabrication credit (code MVHSTELE500) covering our strut connectors, flotation triangles, and aluminum angle stock for the mirror cell.",
    type: "Equipment",
    cashValue: 0,
    contribution: "$500 fabrication credit",
    appliesToBuild: true,
    estimatedRetailValue: 500,
  },
  {
    name: "ToupTek Astro",
    url: "https://www.touptekastro.com",
    description:
      "Astronomy camera and accessory manufacturer. ToupTek shipped a GPM462C guide camera, an AAF electronic auto-focuser, and a cooled deep-sky imaging camera (delivered May 2026) — directly enabling our autonomous imaging pipeline.",
    type: "Equipment",
    cashValue: 0,
    contribution: "GPM462C + AAF + cooled DSO camera",
    appliesToBuild: true,
    estimatedRetailValue: 1750,
  },

  // ── EQUIPMENT DONORS — OUTREACH ────────────────────────────────────────
  {
    name: "Unistellar",
    url: "https://www.unistellar.com",
    productUrl: "https://www.unistellar.com/products/equinox-2",
    description:
      "Maker of smart, app-driven telescopes. Brice Rocton and Unistellar are donating a complete smart telescope to power our community star parties and outreach events.",
    type: "Equipment",
    cashValue: 0,
    contribution: "Smart telescope (outreach)",
    appliesToBuild: false,
  },
  {
    name: "DWARFLAB",
    url: "https://dwarflab.com",
    productUrl: "https://www.dwarflab.com/products/dwarf3",
    description:
      "Maker of the DWARF series of compact smart telescopes. DWARFLAB is shipping a DWARF mini smart telescope for the club's outreach program.",
    type: "Equipment",
    cashValue: 0,
    contribution: "DWARF mini telescope (outreach)",
    appliesToBuild: false,
  },
  {
    name: "Thames & Kosmos",
    url: "https://thamesandkosmos.com",
    productUrl: "https://www.thamesandkosmos.com/",
    description:
      "Educational science kit publisher. Samantha Levinson and the Thames & Kosmos team are sending an in-kind product donation in support of the club's STEM outreach.",
    type: "Equipment",
    cashValue: 0,
    contribution: "Educational kit (outreach)",
    appliesToBuild: false,
  },

  // ── SERVICE PARTNERS ───────────────────────────────────────────────────
  {
    name: "Copy Factory",
    logo: "/sponsors/copy-factory.png",
    url: "https://www.copyfactory.com",
    description:
      "Palo Alto print shop. Todd at Copy Factory is providing in-kind printing services for our outreach flyers, star-party handouts, and event materials — drop-by anytime.",
    type: "Service",
    cashValue: 0,
    contribution: "Printing services (outreach)",
    appliesToBuild: false,
  },
];

export function getTotalCashRaised(): number {
  return sponsors.reduce((sum, s) => sum + s.cashValue, 0);
}

/** Backwards-compat alias used by older imports. */
export const getTotalRaised = getTotalCashRaised;

export function getCashSponsorCount(): number {
  return sponsors.filter((s) => s.type === "Cash").length;
}

export function getInKindSponsorCount(): number {
  return sponsors.filter((s) => s.type !== "Cash").length;
}

export function getSponsorsByType(type: SponsorType): Sponsor[] {
  return sponsors.filter((s) => s.type === type);
}

/** Sum of retail $ value of in-kind contributions that go ONTO the build
 *  (mirror, fab credit, cameras). Excludes Cash sponsors (already counted in
 *  cash totals) and outreach-only donors (smart telescopes, kits) since their
 *  contributions don't reduce build cost. */
export function getInKindBuildValue(): number {
  return sponsors
    .filter((s) => s.appliesToBuild && s.type !== "Cash")
    .reduce((sum, s) => sum + (s.estimatedRetailValue ?? 0), 0);
}

/** Sponsors whose contribution materially reduces build cost. */
export function getBuildSponsors(): Sponsor[] {
  return sponsors.filter((s) => s.appliesToBuild);
}

/** Sponsors supporting outreach but not the build itself. */
export function getOutreachSponsors(): Sponsor[] {
  return sponsors.filter((s) => !s.appliesToBuild);
}
