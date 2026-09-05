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
}

/**
 * Every organisation that has given the project cash, hardware, or a
 * usable credit. Reconciled 2026-09-05 against the club's donor ledger
 * ("Sponsors Who Gave Money or Parts", compiled 2026-08-24 from the club
 * inbox). Ordered by group, then by what they gave.
 */
export const sponsors: Sponsor[] = [
  // ── Cash ──────────────────────────────────────────────────────────────
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
  },
  {
    name: "ToupTek Astro",
    logo: "/sponsors/touptek-astro.png",
    url: "https://www.touptekastro.com",
    type: "Equipment",
    contribution: "ATR585C cooled camera, GPM462C guide camera, AAF autofocuser",
    cashValue: 0,
  },
  {
    name: "Unistellar",
    logo: "/sponsors/unistellar.svg",
    url: "https://www.unistellar.com",
    type: "Equipment",
    contribution: "eQuinox 2 smart telescope for outreach",
    cashValue: 0,
  },
  {
    name: "Pegasus Astro",
    logo: "/sponsors/pegasus-astro.png",
    url: "https://pegasusastro.com",
    type: "Equipment",
    contribution: "Pocket Powerbox Advance Gen 2",
    cashValue: 0,
  },
  {
    name: "DWARFLAB",
    logo: "/sponsors/dwarflab.svg",
    url: "https://dwarflab.com",
    type: "Equipment",
    contribution: "DWARF mini smart telescope for outreach",
    cashValue: 0,
  },
  {
    name: "Celestron",
    logo: "/sponsors/celestron.png",
    url: "https://www.celestron.com",
    type: "Equipment",
    contribution: "X-Cel LX 25 mm and 12 mm eyepieces",
    cashValue: 0,
  },
  {
    name: "Thames & Kosmos",
    logo: "/sponsors/thames-kosmos.svg",
    url: "https://thamesandkosmos.com",
    type: "Equipment",
    contribution: "Plasma ball and planetarium projector for outreach",
    cashValue: 0,
  },

  // ── Fabrication & materials ───────────────────────────────────────────
  {
    name: "SendCutSend",
    logo: "/sponsors/sendcutsend.svg",
    url: "https://sendcutsend.com",
    type: "Fabrication",
    contribution: "$500 laser-cutting credit",
    cashValue: 0,
  },
  {
    name: "PCBWay",
    logo: "/sponsors/pcbway.png",
    url: "https://www.pcbway.com",
    type: "Fabrication",
    contribution: "PCB fabrication for the control electronics",
    cashValue: 0,
  },
  {
    name: "RAFT",
    logo: "/sponsors/raft.png",
    url: "https://raft.net",
    type: "Materials",
    contribution: "Membership and $50 materials credit",
    cashValue: 0,
  },

  // ── Services ──────────────────────────────────────────────────────────
  {
    name: "Copy Factory",
    logo: "/sponsors/copy-factory.png",
    url: "https://www.copyfactory.com",
    type: "Service",
    contribution: "Printing for outreach and star parties",
    cashValue: 0,
  },
  {
    name: "Thomas Fogarty Winery",
    logo: "/sponsors/fogarty-winery.png",
    url: "http://www.fogartywinery.com",
    type: "Service",
    contribution: "Vineyard tour and tasting, fundraiser prize",
    cashValue: 0,
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

export function getSponsorsByType(type: SponsorType): Sponsor[] {
  return sponsors.filter((s) => s.type === type);
}
