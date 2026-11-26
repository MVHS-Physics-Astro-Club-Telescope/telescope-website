export type SponsorType =
  | "Cash"
  | "Equipment"
  | "Fabrication"
  | "Materials"
  | "Service";

export interface Sponsor {
  name: string;
  /** Logo under /public/sponsors/. Only set when we hold a usable file. */
  logo?: string;
  url?: string;
  type: SponsorType;
  /** One line: what they gave. */
  contribution: string;
  /** Direct cash received. In-kind support is never counted here. */
  cashValue: number;
  /**
   * Estimated retail value of donated equipment, credit or services. Left
   * unset when no value is on record.
   */
  inKindValue?: number;
}

/**
 * Every organisation or person that has actually given the project cash,
 * hardware, fabrication, or a usable credit. A promise that has not been
 * delivered yet does not go on this list (PCBWay and Copy Factory came off
 * on 2026-11-25 for that reason: no boards made, no print job yet).
 *
 * Reconciled 2026-11-25 against the sponsor pipeline sheet's Agreed tabs, the
 * "MV Astronomy Finance" sheet (Money In), the donor ledger ("Sponsors Who
 * Gave Money or Parts", 2026-08-24) and the club inbox, including the
 * receiving side of every payment (Venmo notifications). Ordered by group,
 * then by what they gave.
 *
 * In-kind values (2026-10-21) are the ledger's estimated values; the primary
 * mirror is priced at a comparable GSO 10" parabolic primary (Agena Astro,
 * $440). The $2,500 grant is the MVLA High School Foundation's Innovative
 * Learning Grant (named on the site at the finance lead's request,
 * 2026-11-25). OSH Cut sponsored our laser-cut metal order through a discount
 * code (2026-08-31); its dollar value is not on record, so it adds nothing to
 * the in-kind total.
 */
export const sponsors: Sponsor[] = [
  // ── Cash ──────────────────────────────────────────────────────────────
  {
    name: "MVLA High School Foundation",
    url: "https://mvlafoundation.org",
    type: "Cash",
    contribution: "$2,500 Innovative Learning Grant",
    cashValue: 2500,
  },
  {
    name: "Tri-Valley Stargazers",
    url: "https://trivalleystargazers.org",
    type: "Cash",
    contribution: "$500 grant",
    cashValue: 500,
  },
  {
    name: "Crave Yoga",
    logo: "/sponsors/crave-yoga.png",
    url: "https://craveyoga-mv.com",
    type: "Cash",
    contribution: "$250 donation",
    cashValue: 250,
  },
  {
    // Personal gift, received by Venmo 2026-11-25.
    name: "Scott Johnson · Mountain View Rotary Club",
    type: "Cash",
    contribution: "$250 donation",
    cashValue: 250,
  },
  {
    name: "Tori Atwell · The Agency",
    logo: "/sponsors/the-agency.svg",
    url: "https://www.theagencyre.com/agent/tori-atwell/",
    type: "Cash",
    contribution: "$100 donation",
    cashValue: 100,
  },

  // ── Equipment ─────────────────────────────────────────────────────────
  {
    name: "Pacific Holographics",
    logo: "/sponsors/pacific-holographics.png",
    url: "http://pacholo.com",
    type: "Equipment",
    contribution: "254 mm f/4.48 parabolic primary mirror",
    cashValue: 0,
    inKindValue: 440,
  },
  {
    name: "ToupTek Astro",
    logo: "/sponsors/touptek-astro.png",
    url: "https://www.touptekastro.com",
    type: "Equipment",
    contribution: "ATR585C cooled camera, GPM462C guide camera, AAF autofocuser",
    cashValue: 0,
    inKindValue: 579,
  },
  {
    name: "Unistellar",
    logo: "/sponsors/unistellar.svg",
    url: "https://www.unistellar.com",
    type: "Equipment",
    contribution: "eQuinox 2 smart telescope for outreach",
    cashValue: 0,
    inKindValue: 2899,
  },
  {
    name: "Pegasus Astro",
    logo: "/sponsors/pegasus-astro.png",
    url: "https://pegasusastro.com",
    type: "Equipment",
    contribution: "Pocket Powerbox Advance Gen 2",
    cashValue: 0,
    inKindValue: 460,
  },
  {
    name: "DWARFLAB",
    logo: "/sponsors/dwarflab.svg",
    url: "https://dwarflab.com",
    type: "Equipment",
    contribution: "DWARF mini smart telescope for outreach",
    cashValue: 0,
    inKindValue: 399,
  },
  {
    name: "Celestron",
    logo: "/sponsors/celestron.png",
    url: "https://www.celestron.com",
    type: "Equipment",
    contribution: "X-Cel LX 25 mm and 12 mm eyepieces",
    cashValue: 0,
    inKindValue: 219.9,
  },
  {
    name: "Thames & Kosmos",
    logo: "/sponsors/thames-kosmos.svg",
    url: "https://thamesandkosmos.com",
    type: "Equipment",
    contribution: "Plasma ball and planetarium projector for outreach",
    cashValue: 0,
    inKindValue: 64.9,
  },

  // ── Fabrication & materials ───────────────────────────────────────────
  {
    name: "SendCutSend",
    logo: "/sponsors/sendcutsend.svg",
    url: "https://sendcutsend.com",
    type: "Fabrication",
    contribution: "$500 laser-cutting credit",
    cashValue: 0,
    inKindValue: 500,
  },
  {
    name: "OSH Cut",
    logo: "/sponsors/oshcut.svg",
    url: "https://www.oshcut.com",
    type: "Fabrication",
    contribution: "Sponsored laser cutting for our metal parts",
    cashValue: 0,
  },
  {
    name: "RAFT",
    logo: "/sponsors/raft.png",
    url: "https://raft.net",
    type: "Materials",
    contribution: "Membership and $50 materials credit",
    cashValue: 0,
    inKindValue: 50,
  },

  // ── Services ──────────────────────────────────────────────────────────
  {
    name: "Thomas Fogarty Winery",
    logo: "/sponsors/fogarty-winery.png",
    url: "http://www.fogartywinery.com",
    type: "Service",
    contribution: "Vineyard tour and tasting, fundraiser prize",
    cashValue: 0,
    inKindValue: 650,
  },
];

export const sponsorGroups: { type: SponsorType; heading: string }[] = [
  { type: "Cash", heading: "Cash" },
  { type: "Equipment", heading: "Equipment" },
  { type: "Fabrication", heading: "Fabrication" },
  { type: "Materials", heading: "Materials" },
  { type: "Service", heading: "Services" },
];

export function getTotalCashRaised(): number {
  return sponsors.reduce((sum, s) => sum + s.cashValue, 0);
}

export function getTotalInKindValue(): number {
  return sponsors.reduce((sum, s) => sum + (s.inKindValue ?? 0), 0);
}

/** Cash plus the estimated value of everything donated, in whole dollars. */
export function getTotalSupport(): number {
  return Math.floor(getTotalCashRaised() + getTotalInKindValue());
}

export function getSponsorsByType(type: SponsorType): Sponsor[] {
  return sponsors.filter((s) => s.type === type);
}
