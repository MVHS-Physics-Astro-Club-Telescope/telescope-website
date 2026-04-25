export type SponsorType = "Cash" | "Equipment" | "Service" | "Materials";

export interface Sponsor {
  name: string;
  /** Path to logo file in /public/sponsors/. Only set if we have an actual,
   *  usable logo file (verified). Otherwise the card renders with a clean
   *  text wordmark. */
  logo?: string;
  url?: string;
  description: string;
  type: SponsorType;
  /** Direct cash given to the project. Only Cash-type sponsors have non-zero
   *  values here. Service credits, equipment, vouchers, and store credits
   *  are NOT counted toward cash totals — they're tracked as in-kind. */
  cashValue: number;
  /** Display string for the contribution (e.g. "$500 fabrication credit",
   *  "DWARF mini telescope"). */
  contribution: string;
}

export const sponsors: Sponsor[] = [
  // ── CASH SPONSORS ──────────────────────────────────────────────────────
  {
    name: "Crave Yoga",
    url: "https://craveyoga-mv.com",
    description:
      "Mountain View community yoga studio. Helena McLoughlin and Crave Yoga submitted a direct cash donation to the project via our sponsor form.",
    type: "Cash",
    cashValue: 250,
    contribution: "$250 cash donation",
  },
  {
    name: "Tori Atwell — The Agency RE",
    url: "https://www.theagencyre.com/agent/tori-atwell/",
    description:
      "Bay Area real estate broker-associate at The Agency. Tori is supporting the project with a direct cash donation, mailed via check to MVHS.",
    type: "Cash",
    cashValue: 100,
    contribution: "$100 cash donation",
  },

  // ── EQUIPMENT DONORS ───────────────────────────────────────────────────
  {
    name: "Pacific Holographic",
    logo: "/sponsors/pacific-holographics.png",
    url: "http://pacholo.com",
    description:
      "Pacific Holographic specializes in precision holographic optical elements. They donated the 254mm (10\") f/4.48 parabolic primary mirror that anchors our entire optical design.",
    type: "Equipment",
    cashValue: 0,
    contribution: "254mm primary mirror",
  },
  {
    name: "SendCutSend",
    logo: "/sponsors/sendcutsend.svg",
    url: "https://sendcutsend.com",
    description:
      "Online laser cutting, waterjet cutting, and metal fabrication. SendCutSend issued a $500 fabrication credit (code MVHSTELE500) we'll use to manufacture our truss connectors, mirror cell, and other precision metal parts.",
    type: "Equipment",
    cashValue: 0,
    contribution: "$500 fabrication credit",
  },
  {
    name: "Unistellar",
    url: "https://www.unistellar.com",
    description:
      "Maker of smart, app-driven telescopes. Brice Rocton and Unistellar are donating a complete smart telescope to power our community star parties and outreach events.",
    type: "Equipment",
    cashValue: 0,
    contribution: "Smart telescope",
  },
  {
    name: "DWARFLAB",
    url: "https://dwarflab.com",
    description:
      "Maker of the DWARF series of compact smart telescopes. DWARFLAB is shipping a DWARF mini smart telescope for the club's outreach program.",
    type: "Equipment",
    cashValue: 0,
    contribution: "DWARF mini telescope",
  },
  {
    name: "ToupTek Astro",
    url: "https://www.touptekastro.com",
    description:
      "Astronomy camera and accessory manufacturer. ToupTek is providing a GPM462C guide camera, an AAF electronic auto-focuser, and a cooled deep-sky imaging camera — directly enabling our autonomous imaging pipeline.",
    type: "Equipment",
    cashValue: 0,
    contribution: "GPM462C + AAF + cooled DSO camera",
  },
  {
    name: "Thames & Kosmos",
    url: "https://thamesandkosmos.com",
    description:
      "Educational science kit publisher. Samantha Levinson and the Thames & Kosmos team are sending an in-kind product donation in support of the club's STEM outreach.",
    type: "Equipment",
    cashValue: 0,
    contribution: "Educational kit (in-kind)",
  },

  // ── MATERIALS PARTNERS ─────────────────────────────────────────────────
  {
    name: "RAFT",
    logo: "/sponsors/raft.png",
    url: "https://raft.net",
    description:
      "Resource Area for Teaching — a Bay Area nonprofit providing hands-on STEM materials to educators and youth programs. Nancy McIntyre extended us a RAFT membership and a $50 store credit toward build supplies.",
    type: "Materials",
    cashValue: 0,
    contribution: "$50 store credit + membership",
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
    contribution: "Printing services (in-kind)",
  },
  {
    name: "Fogarty Winery",
    url: "http://www.fogartywinery.com",
    description:
      "Estate winery in Woodside, established 1981. Heather Carrie and the Fogarty team are supporting the project with a tour voucher and event hospitality for our team and partners.",
    type: "Service",
    cashValue: 0,
    contribution: "Tour voucher + hospitality",
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
