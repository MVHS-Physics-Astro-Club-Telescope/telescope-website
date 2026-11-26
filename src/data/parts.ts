import { sponsors } from "./sponsors";

export type PartStatus = "Donated" | "Bought" | "Needed";
export type PartCategory =
  | "Optics"
  | "Upper tube"
  | "Lower assembly"
  | "Electronics"
  | "Camera"
  | "Accessories";

export interface Part {
  name: string;
  category: PartCategory;
  specification: string;
  quantity: number;
  /**
   * Line total in US dollars for every unit on the row, from the finance
   * sheet's Orders tab. `null` means not priced yet. Donated parts carry no
   * cost here: the donor's gift is valued once, in `sponsors.ts`.
   */
  cost: number | null;
  status: PartStatus;
  notes?: string;
  /** Must match a `name` in `sponsors.ts` exactly; their in-kind value feeds the build cost. */
  donatedBy?: string;
  /** Row ID on the Orders tab of the "MV Astronomy Finance" sheet. */
  orderId?: string;
  /** CAD render tile under /public/cad/parts/ */
  image?: string;
  purchaseUrl?: string;
}

/**
 * The telescope's bill of materials for the current design (UTA v6 and the
 * October electrical order), rebuilt 2026-11-25 from the Orders tab of the
 * "MV Astronomy Finance" sheet. That tab is the team's purchasing record:
 * every bought or waiting row here carries its Orders ID, quantity, line
 * total and link from there. Cancelled rows are left out.
 *
 * The rocker box and mirror box are aluminium (the plywood design was dropped
 * on 2026-11-11) and are one unpriced row until mech posts that parts list.
 * The September list this replaces (wood rocker box, printed v5 upper tube)
 * is in git history.
 */
export const parts: Part[] = [
  // ── Optics ──────────────────────────────────────────
  {
    name: "Primary Mirror",
    image: "/cad/parts/primary-mirror.png",
    category: "Optics",
    specification: '254 mm (10") f/4.48 parabolic',
    quantity: 1,
    cost: null,
    status: "Donated",
    notes: "The heart of the telescope",
    donatedBy: "Pacific Holographics",
  },
  {
    name: "Secondary Mirror",
    image: "/cad/parts/secondary-mirror.png",
    category: "Optics",
    specification: "GSO 70 mm elliptical flat (AD009)",
    quantity: 1,
    cost: 87.7,
    status: "Bought",
    orderId: "E-90",
    purchaseUrl: "https://agenaastro.com/gso-elliptical-secondary-mirror-70-mm.html",
  },
  {
    name: "Focuser",
    image: "/cad/parts/focuser-gso.png",
    category: "Optics",
    specification: 'GSO 2" dual-speed rack & pinion, EAF-ready (Agena DW444) + flat base plate',
    quantity: 1,
    cost: 265,
    status: "Needed",
    orderId: "U-01",
    purchaseUrl: "https://agenaastro.com/gso-rack-pinion-focuser-reflector-telescope-dual-speed-bundle.html",
  },
  {
    name: "Coma Corrector",
    category: "Optics",
    specification: "Explore Scientific HR coma corrector HRCC02-00, M42/M48 camera adapters",
    quantity: 1,
    cost: 249.99,
    status: "Needed",
    orderId: "U-02",
    purchaseUrl: "https://explorescientific.com/products/coma-corrector",
  },
  {
    name: "Flocking Paper",
    category: "Optics",
    specification: 'Edmund #55 adhesive flock paper, 20 × 30", 2 sheets (#54-585)',
    quantity: 1,
    cost: 36,
    status: "Needed",
    notes: "Lines the upper tube to kill stray light",
    orderId: "U-28",
    purchaseUrl: "https://www.edmundoptics.com/p/55-20quot-x-30quot-2-sheets-adhesive-flock-paper/11273/",
  },

  // ── Upper tube ──────────────────────────────────────
  {
    name: "Truss Tubes",
    category: "Upper tube",
    specification: '6061-T6 aluminium tube, 1" OD × 0.058" wall, 72"',
    quantity: 2,
    cost: 67.52,
    status: "Needed",
    orderId: "U-06",
    purchaseUrl: "https://www.onlinemetals.com/en/buy/aluminum/1-od-x-0-058-wall-x-0-884-id-aluminum-round-tube-6061-t6-drawn/pid/4342",
  },
  {
    name: "Tube Plugs",
    category: "Upper tube",
    specification: 'Cosmostar 1" round plastic plugs, 10-pack',
    quantity: 1,
    cost: 9.99,
    status: "Needed",
    orderId: "U-07",
    purchaseUrl: "https://www.amazon.com/dp/B0D1C4TMDS",
  },
  {
    name: "Spider Vanes + Push Discs",
    image: "/cad/parts/spider-vane.png",
    category: "Upper tube",
    specification: '304 stainless, 0.030": 4 vanes + 3 push discs',
    quantity: 1,
    cost: null,
    status: "Needed",
    notes: "Laser cut by SendCutSend and paid with their $500 sponsor credit",
    orderId: "U-10",
    purchaseUrl: "https://sendcutsend.com/stainless-steel",
  },
  {
    name: "ASA Filament",
    category: "Upper tube",
    specification: "Elegoo ASA, Deep Black, 1 kg",
    quantity: 3,
    cost: 50.97,
    status: "Needed",
    notes: "Prints the upper tube's structural plates in-house",
    orderId: "U-27",
    purchaseUrl: "https://us.elegoo.com/products/asa-filament-1-75mm-colored-1kg",
  },
  {
    name: "Collimation Springs",
    image: "/cad/parts/spring-collim.png",
    category: "Upper tube",
    specification: "Lee Spring LC 059E 12 S, 302 stainless compression spring",
    quantity: 2,
    cost: 17.14,
    status: "Needed",
    orderId: "U-11",
    purchaseUrl: "https://www.leespring.com/product/compression-spring-lc059e12s-stainless-steel",
  },
  {
    name: "Disc Springs",
    category: "Upper tube",
    specification: "Disc & Belleville DS-100406, 10 × 4.2 × 0.6 mm, 10-pack",
    quantity: 1,
    cost: 36,
    status: "Needed",
    orderId: "U-12",
    purchaseUrl: "https://www.amazon.com/dp/B017TDDV4W",
  },
  {
    name: "Finder Shoes",
    category: "Upper tube",
    specification: "Agena FURB Synta-style finder shoe (standard)",
    quantity: 2,
    cost: 23.9,
    status: "Needed",
    orderId: "U-05",
    purchaseUrl: "https://agenaastro.com/agena-universal-dovetail-mounting-base.html",
  },
  {
    name: "Star Knobs",
    image: "/cad/parts/knob-bolt.png",
    category: "Upper tube",
    specification: "uxcell M5 × 25 stainless, with nuts and washers, 8-pack",
    quantity: 1,
    cost: 8.99,
    status: "Needed",
    orderId: "U-08",
    purchaseUrl: "https://www.amazon.com/dp/B0DLGWBSRC",
  },
  {
    name: "Heat-Set Inserts",
    image: "/cad/parts/insert-m4.png",
    category: "Upper tube",
    specification: "ruthex M2–M5 bundle + soldering tips",
    quantity: 1,
    cost: 42.99,
    status: "Needed",
    orderId: "U-16",
    purchaseUrl: "https://www.amazon.com/dp/B0FCXXW62N",
  },
  {
    name: "Socket Head Screw Kit",
    category: "Upper tube",
    specification: "Mywish 900-piece M3–M6",
    quantity: 1,
    cost: 18.99,
    status: "Needed",
    orderId: "U-17",
    purchaseUrl: "https://www.amazon.com/dp/B0CWTP62N8",
  },
  {
    name: "M4 × 16 Socket Head",
    category: "Upper tube",
    specification: "DIN 912, 10-pack (spares)",
    quantity: 1,
    cost: 6.82,
    status: "Needed",
    orderId: "U-18",
    purchaseUrl: "https://www.amazon.com/dp/B078LBMNHV",
  },
  {
    name: "M3 × 6 Button Head",
    category: "Upper tube",
    specification: "100-pack",
    quantity: 1,
    cost: 7.69,
    status: "Needed",
    orderId: "U-19",
    purchaseUrl: "https://www.amazon.com/dp/B0GH6C7BK6",
  },
  {
    name: "M4 × 16 Button Head",
    category: "Upper tube",
    specification: "ISO 7380, 10-pack",
    quantity: 1,
    cost: 6.9,
    status: "Needed",
    orderId: "U-20",
    purchaseUrl: "https://www.amazon.com/dp/B078YDDBQC",
  },
  {
    name: "M4 × 16 Flat Head",
    category: "Upper tube",
    specification: "DIN 7991, 10-pack",
    quantity: 1,
    cost: 6.85,
    status: "Needed",
    orderId: "U-21",
    purchaseUrl: "https://www.amazon.com/dp/B078YYW35J",
  },
  {
    name: "M4 × 20 Flat Head",
    category: "Upper tube",
    specification: "DIN 7991, 40-pack",
    quantity: 1,
    cost: 6.58,
    status: "Needed",
    orderId: "U-22",
    purchaseUrl: "https://www.amazon.com/dp/B0DKY7L8KP",
  },
  {
    name: "M4 × 10 Socket Head",
    category: "Upper tube",
    specification: "DIN 912, 55-pack",
    quantity: 1,
    cost: 9.69,
    status: "Needed",
    orderId: "U-23",
    purchaseUrl: "https://www.amazon.com/dp/B01M6ZBZQQ",
  },
  {
    name: "M4 × 40 Socket Head",
    category: "Upper tube",
    specification: "DIN 912, 10-pack",
    quantity: 1,
    cost: 7.55,
    status: "Needed",
    orderId: "U-24",
    purchaseUrl: "https://www.amazon.com/dp/B078L7NSWP",
  },
  {
    name: "M5 × 50 Socket Head",
    category: "Upper tube",
    specification: "25-pack",
    quantity: 1,
    cost: 8.69,
    status: "Needed",
    orderId: "U-25",
    purchaseUrl: "https://www.amazon.com/dp/B0B5NWKZSH",
  },
  {
    name: "M4 Nylon Lock Nuts",
    image: "/cad/parts/nut-m4.png",
    category: "Upper tube",
    specification: "30-pack",
    quantity: 1,
    cost: 5.29,
    status: "Needed",
    orderId: "U-26",
    purchaseUrl: "https://www.amazon.com/dp/B0H4HH41R2",
  },
  {
    name: "RTV Silicone",
    category: "Upper tube",
    specification: "Permatex 80050 clear, 3 oz",
    quantity: 1,
    cost: 5.37,
    status: "Needed",
    orderId: "U-15",
    purchaseUrl: "https://www.amazon.com/dp/B0002UEPVI",
  },
  {
    name: "Cobalt Drill Bit",
    category: "Upper tube",
    specification: "4.2 mm, 2-pack",
    quantity: 1,
    cost: 5.99,
    status: "Needed",
    orderId: "U-03",
    purchaseUrl: "https://www.amazon.com/dp/B08P6RMK7B",
  },

  // ── Lower assembly ──────────────────────────────────
  {
    name: "Rocker Box + Mirror Box",
    category: "Lower assembly",
    specification: "Aluminium, laser cut by OSH Cut",
    quantity: 1,
    cost: null,
    status: "Needed",
    notes: "Not priced yet: the parts list comes out of mech's CAD",
    orderId: "M-01",
  },

  // ── Electronics ─────────────────────────────────────
  {
    name: "Battery",
    category: "Electronics",
    specification: "Redodo 12 V 50 Ah LiFePO4, 50 A BMS",
    quantity: 1,
    cost: 167.39,
    status: "Bought",
    orderId: "E-01",
    purchaseUrl: "https://www.amazon.com/dp/B0CYZWLV3G",
  },
  {
    name: "Battery Charger",
    category: "Electronics",
    specification: "BROODAY 14.6 V 10 A LiFePO4, alligator clips",
    quantity: 1,
    cost: 19.99,
    status: "Bought",
    orderId: "E-02",
    purchaseUrl: "https://www.amazon.com/dp/B0D8W1THH6",
  },
  {
    name: "Kill Switch",
    category: "Electronics",
    specification: "SEAFLO 275 A",
    quantity: 1,
    cost: 17.99,
    status: "Bought",
    orderId: "E-04",
    purchaseUrl: "https://www.amazon.com/dp/B00EBQOKEQ",
  },
  {
    name: "Fuse Block",
    category: "Electronics",
    specification: "WUPP 6-way with negative bus",
    quantity: 1,
    cost: 11.98,
    status: "Bought",
    orderId: "E-05",
    purchaseUrl: "https://www.amazon.com/dp/B07GBV2MHN",
  },
  {
    name: "Main Fuse Holder",
    category: "Electronics",
    specification: "Powerwerx IFH-12-02, ATC/ATO inline, 12 AWG",
    quantity: 1,
    cost: 2.89,
    status: "Needed",
    orderId: "E-03",
    purchaseUrl: "https://powerwerx.com/atc-ato-inline-fuse-holder-12-gauge-red",
  },
  {
    name: "Stepper Drivers",
    category: "Electronics",
    specification: "STEPPERONLINE DM542T (V4.0)",
    quantity: 2,
    cost: 65.98,
    status: "Bought",
    orderId: "E-11",
    purchaseUrl: "https://www.amazon.com/dp/B06Y5VPSFN",
  },
  {
    name: "Altitude Motor",
    image: "/cad/parts/nema23.png",
    category: "Electronics",
    specification: "STEPPERONLINE 23HS39-5004S, NEMA 23, 3.0 Nm",
    quantity: 1,
    cost: 29.5,
    status: "Needed",
    notes: "On hold until mech picks the motors",
    orderId: "E-09",
    purchaseUrl: "https://www.amazon.com/dp/B0DSD9YF72",
  },
  {
    name: "Azimuth Motor",
    image: "/cad/parts/nema17.png",
    category: "Electronics",
    specification: "STEPPERONLINE 17HS19-2004S1, NEMA 17, 59 Ncm",
    quantity: 1,
    cost: 14.99,
    status: "Needed",
    notes: "On hold until mech picks the motors",
    orderId: "E-10",
    purchaseUrl: "https://www.amazon.com/dp/B00PNEQKC0",
  },
  {
    name: "12 V → 24 V Converter",
    category: "Electronics",
    specification: "Mean Well SD-50A-24",
    quantity: 1,
    cost: 37.61,
    status: "Needed",
    orderId: "E-12",
    purchaseUrl: "https://www.jameco.com/z/SD-50A-24-MEAN-WELL-DC-DC-Power-Supply-Single-Output-24-Volt-2-1A-50-4W-5-Pin-9-18Vin_2107266.html",
  },
  {
    name: "Bulk Capacitors",
    category: "Electronics",
    specification: "Nichicon UPW1J102MHD6, 1000 µF 63 V",
    quantity: 2,
    cost: 5.62,
    status: "Needed",
    orderId: "E-13",
    purchaseUrl: "https://www.digikey.com/en/products/detail/nichicon/UPW1J102MHD6/589698",
  },
  {
    name: "Level Shifter",
    category: "Electronics",
    specification: "TI SN74ACT244N (DIP-20)",
    quantity: 1,
    cost: 1.94,
    status: "Needed",
    orderId: "E-14",
    purchaseUrl: "https://www.digikey.com/en/products/detail/texas-instruments/SN74ACT244N/375910",
  },
  {
    name: "Decoupling Capacitor",
    category: "Electronics",
    specification: "KEMET C320C104K5R5TA, 0.1 µF ceramic",
    quantity: 1,
    cost: 1.49,
    status: "Needed",
    orderId: "E-15",
    purchaseUrl: "https://www.digikey.com/en/products/result?keywords=C320C104K5R5TA",
  },
  {
    name: "Current + Voltage Sensor",
    category: "Electronics",
    specification: "INA260 breakout",
    quantity: 1,
    cost: null,
    status: "Needed",
    notes: "Exact part not picked yet",
    orderId: "E-18",
  },
  {
    name: "Solderable Breadboard",
    category: "Electronics",
    specification: "ElectroCookie half-size",
    quantity: 1,
    cost: 8.79,
    status: "Bought",
    orderId: "E-16",
    purchaseUrl: "https://www.amazon.com/dp/B07ZV8FWM4",
  },
  {
    name: "12 AWG Wire",
    category: "Electronics",
    specification: "BNTECHGO copper silicone, 10 ft red + 10 ft black",
    quantity: 1,
    cost: 14.98,
    status: "Bought",
    orderId: "E-07",
    purchaseUrl: "https://www.amazon.com/dp/B01ABOPMEI",
  },
  {
    name: "Ring Terminal Kit",
    category: "Electronics",
    specification: '12–10 AWG heat-shrink, #10 / 1/4" / 5/16" / 3/8" studs',
    quantity: 1,
    cost: 9.99,
    status: "Bought",
    orderId: "E-06",
    purchaseUrl: "https://www.amazon.com/dp/B0DM8DTNL2",
  },
  {
    name: "Terminal Kit",
    category: "Electronics",
    specification: "TICONN 22–10 AWG, 120 pcs heat-shrink (ring, fork, butt, quick-disconnect)",
    quantity: 1,
    cost: 9.99,
    status: "Bought",
    orderId: "E-17",
    purchaseUrl: "https://www.amazon.com/dp/B086Z2Y1D6",
  },
  {
    name: "Barrel Pigtail",
    category: "Electronics",
    specification: "16 AWG, male 5.5 × 2.1 mm",
    quantity: 1,
    cost: 7.99,
    status: "Bought",
    orderId: "E-08",
    purchaseUrl: "https://www.amazon.com/dp/B07VW5VRX7",
  },
  {
    name: "Pegasus Pocket Powerbox Advance Gen 2",
    category: "Electronics",
    specification: "12 V power distribution, dew heater outputs, USB hub",
    quantity: 1,
    cost: null,
    status: "Donated",
    donatedBy: "Pegasus Astro",
  },
  {
    name: "Raspberry Pi 4",
    category: "Electronics",
    specification: "Model B, 4 GB",
    quantity: 1,
    cost: null,
    status: "Donated",
    notes: "Main computer: tracking, imaging and the web server",
  },
  {
    name: "MicroSD Card",
    category: "Electronics",
    specification: "64 GB, A2",
    quantity: 1,
    cost: null,
    status: "Donated",
  },
  {
    name: "Ethernet Cable",
    category: "Electronics",
    specification: "Cat5e/6",
    quantity: 1,
    cost: null,
    status: "Donated",
  },

  // ── Camera ──────────────────────────────────────────
  {
    name: "ToupTek ATR585C Cooled Camera",
    category: "Camera",
    specification: "IMX585 colour sensor, thermoelectric cooling",
    quantity: 1,
    cost: null,
    status: "Donated",
    donatedBy: "ToupTek Astro",
  },
  {
    name: "ToupTek GPM462C Guide Camera",
    category: "Camera",
    specification: "IMX462 guide camera",
    quantity: 1,
    cost: null,
    status: "Donated",
    notes: "Autoguider for closed-loop tracking",
    donatedBy: "ToupTek Astro",
  },
  {
    name: "ToupTek AAF Autofocuser",
    category: "Camera",
    specification: "Electronic autofocuser",
    quantity: 1,
    cost: null,
    status: "Donated",
    notes: "Drives the focuser for motorised fine focus",
    donatedBy: "ToupTek Astro",
  },

  // ── Accessories ─────────────────────────────────────
  {
    name: "Light Shroud",
    category: "Accessories",
    specification: 'Explore Scientific Dobsonian shroud, 10"/12" truss',
    quantity: 1,
    cost: 99.99,
    status: "Needed",
    notes: "Blocks stray light through the truss",
    orderId: "U-09",
    purchaseUrl: "https://explorescientific.com/products/dobsonian-shroud-for-10-truss-tube-dob",
  },
  {
    name: "Dew Heater Film",
    category: "Accessories",
    specification: "MECCANIXITY 12 V 7 W, 50 × 25 mm, 6-pack",
    quantity: 1,
    cost: 14.69,
    status: "Needed",
    orderId: "U-13",
    purchaseUrl: "https://www.amazon.com/dp/B0CLS4QMQV",
  },
  {
    name: "Heater Leads",
    category: "Accessories",
    specification: "SIOCEN RCA male to bare wire, 1 ft, 3-pack",
    quantity: 1,
    cost: 7.99,
    status: "Needed",
    notes: "Connect the heater film to the Pegasus dew outputs",
    orderId: "U-14",
    purchaseUrl: "https://www.amazon.com/dp/B0BVPYYD8K",
  },
  {
    name: "Eyepieces",
    category: "Accessories",
    specification: "Celestron X-Cel LX 25 mm and 12 mm",
    quantity: 2,
    cost: null,
    status: "Donated",
    donatedBy: "Celestron",
  },
];

export const categories: PartCategory[] = [
  "Optics",
  "Upper tube",
  "Lower assembly",
  "Electronics",
  "Camera",
  "Accessories",
];

const dollars = (n: number) => Math.round(n * 100) / 100;

/** Everything bought or still to buy, from the Orders tab's line totals. */
export function getPartsCost(): number {
  return dollars(parts.reduce((sum, p) => sum + (p.status === "Donated" ? 0 : (p.cost ?? 0)), 0));
}

/** What is still to buy (priced rows only). */
export function getStillToBuy(): number {
  return dollars(parts.reduce((sum, p) => sum + (p.status === "Needed" ? (p.cost ?? 0) : 0), 0));
}

/**
 * Retail value of the donated parts on the instrument, taken once per donor
 * from `sponsors.ts`. Donors with no value on record (the Raspberry Pi kit)
 * add nothing.
 */
export function getDonatedPartsValue(): number {
  const donors = new Set(parts.filter((p) => p.status === "Donated" && p.donatedBy).map((p) => p.donatedBy));
  return dollars(
    sponsors.filter((s) => donors.has(s.name)).reduce((sum, s) => sum + (s.inKindValue ?? 0), 0),
  );
}

/**
 * Every part on the telescope at retail, donated or bought, in whole dollars.
 * Unpriced rows (the rocker box and mirror box, the INA260, the SendCutSend
 * vanes) are not in it yet.
 */
export function getBuildCost(): number {
  return Math.floor(getPartsCost() + getDonatedPartsValue());
}

export function getPartsByCategory(category: PartCategory): Part[] {
  return parts.filter((p) => p.category === category);
}

export function getStatusCounts(): Record<PartStatus, number> {
  const counts: Record<PartStatus, number> = { Donated: 0, Bought: 0, Needed: 0 };
  for (const part of parts) counts[part.status]++;
  return counts;
}
