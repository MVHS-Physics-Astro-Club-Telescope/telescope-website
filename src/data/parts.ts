export type PartStatus = "Donated" | "Ordered" | "Needed" | "Claimed";
export type PartCategory =
  | "Optics"
  | "Structure"
  | "Bearings"
  | "Mirror Cell"
  | "Electronics"
  | "Camera"
  | "Accessories";

export interface Part {
  name: string;
  category: PartCategory;
  specification: string;
  quantity: number;
  estimatedCost: string;
  status: PartStatus;
  notes?: string;
  donatedBy?: string;
  purchaseUrl?: string;
}

export const parts: Part[] = [
  // ── Optics ──────────────────────────────────────────
  {
    name: "Primary Mirror",
    category: "Optics",
    specification: '254mm (10") f/4.48 parabolic',
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "Generously donated — the heart of our telescope",
    donatedBy: "Pacific Holographic",
  },
  {
    name: "Secondary Mirror",
    category: "Optics",
    specification: "70mm minor axis elliptical flat",
    quantity: 1,
    estimatedCost: "$39–49",
    status: "Needed",
    purchaseUrl: "https://agenaastro.com/gso-elliptical-secondary-mirror-70-mm.html",
  },
  {
    name: "Spider + Secondary Holder",
    category: "Optics",
    specification: "4-vane spider with adjustable holder",
    quantity: 1,
    estimatedCost: "$85–120",
    status: "Needed",
    purchaseUrl: "https://www.fpi-protostar.com/s4vmnts.htm",
  },
  {
    name: "Focuser",
    category: "Optics",
    specification: '1.25" Crayford-style dual-speed',
    quantity: 1,
    estimatedCost: "$115–135",
    status: "Needed",
    purchaseUrl: "https://us.amazon.com/GSO-Speed-Crayford-Style-Focuser/dp/B095H3Q3KH",
  },
  {
    name: "Flocking Material",
    category: "Optics",
    specification: "Self-adhesive black velour",
    quantity: 1,
    estimatedCost: "$15–20",
    status: "Needed",
    notes: "Lines the upper tube assembly to reduce stray light",
    purchaseUrl: "https://www.amazon.com/MINZIHAO-Flocking-Adhesive-100x48cm-Telescope/dp/B0DT6VHK1H",
  },

  // ── Structure ───────────────────────────────────────
  {
    name: "Cabinet-Grade Plywood",
    category: "Structure",
    specification: '3/4" Baltic birch plywood sheets',
    quantity: 1,
    estimatedCost: "$60–70",
    status: "Needed",
    notes: "Mirror box, rocker box, and ground board",
    purchaseUrl: "https://www.homedepot.com/p/Columbia-Forest-Products-3-4-in-x-4-ft-x-8-ft-PureBond-Birch-Plywood-165921/100077837",
  },
  {
    name: "Ground Board",
    category: "Structure",
    specification: '3/4" plywood, 20" diameter',
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
    purchaseUrl: "https://www.homedepot.com/p/Columbia-Forest-Products-3-4-in-x-4-ft-x-8-ft-PureBond-Birch-Plywood-165921/100077837",
  },
  {
    name: "Aluminum Tubes",
    category: "Structure",
    specification: '1" OD × 0.058" wall truss poles',
    quantity: 8,
    estimatedCost: "$50–70",
    status: "Needed",
    notes: "Upper tube assembly truss structure",
    purchaseUrl: "https://www.onlinemetals.com/en/buy/aluminum/1-od-x-0-058-wall-x-0-884-id-aluminum-round-tube-6061-t6-drawn/pid/4342",
  },
  {
    name: "Strut Connectors",
    category: "Structure",
    specification: "CNC aluminum clamp blocks",
    quantity: 16,
    estimatedCost: "$40–80",
    status: "Needed",
    purchaseUrl: "https://www.aurorap.com/cage-truss-clamp",
  },
  {
    name: "T-Nuts",
    category: "Structure",
    specification: "1/4-20 pronged T-nuts",
    quantity: 16,
    estimatedCost: "$8–10",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/POWERTEC-QTN1103-Pronged-16-Inch-18-50-Pack/dp/B073XKP9SH",
  },
  {
    name: "Dowel Pins",
    category: "Structure",
    specification: '3/8" steel alignment pins',
    quantity: 16,
    estimatedCost: "$40–48",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Precision-Alignment-Hardness-Strength-Shelving/dp/B01GGSA4BE",
  },
  {
    name: "Hardware Box",
    category: "Structure",
    specification: "Assorted bolts, nuts, washers",
    quantity: 1,
    estimatedCost: "$20–25",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Bolts-Nuts-Flat-Spring-Washers/dp/B09BLSR1Y1",
  },
  {
    name: "Wood Glue + Finish",
    category: "Structure",
    specification: "Titebond III + polyurethane",
    quantity: 1,
    estimatedCost: "$16–20",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Titebond-1415-Ultimate-32-Ounce-Bottle/dp/B0002YQ3KU",
  },
  {
    name: "Paint",
    category: "Structure",
    specification: "Flat black interior, satin exterior",
    quantity: 1,
    estimatedCost: "$6–8",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Krylon-K05546007-COLORmaxx-Spray-Aerosol/dp/B07LFWTW93",
  },

  // ── Bearings ────────────────────────────────────────
  {
    name: "PTFE Altitude Pads",
    category: "Bearings",
    specification: '1" × 2" virgin PTFE',
    quantity: 4,
    estimatedCost: "$36",
    status: "Needed",
    notes: "Kit includes both altitude + azimuth pads",
    purchaseUrl: "https://cloudbreakoptics.com/products/teflon-bearing-kits",
  },
  {
    name: "PTFE Azimuth Pads",
    category: "Bearings",
    specification: '1.5" × 2" virgin PTFE',
    quantity: 3,
    estimatedCost: "Incl. in kit",
    status: "Needed",
    notes: "Included in altitude pads bearing kit",
    purchaseUrl: "https://cloudbreakoptics.com/products/teflon-bearing-kits",
  },
  {
    name: "Ebony Star Laminate",
    category: "Bearings",
    specification: "Wilsonart Ebony Star surface",
    quantity: 1,
    estimatedCost: "$15–20",
    status: "Needed",
    notes: "Low-friction bearing surface",
    purchaseUrl: "https://www.homedepot.com/p/Wilsonart-4-ft-x-8-ft-Laminate-Sheet-in-Ebony-Star-with-Premium-Textured-Gloss-Finish-4552K73504896/202840225",
  },
  {
    name: "Pivot Bolt",
    category: "Bearings",
    specification: '3/8"-16 × 3" stainless steel',
    quantity: 1,
    estimatedCost: "$13",
    status: "Needed",
    purchaseUrl: "https://www.homedepot.com/p/Everbilt-3-8-in-16-x-3-in-Stainless-Steel-Hex-Bolt-5-Pack-812410/302007786",
  },

  // ── Mirror Cell ─────────────────────────────────────
  {
    name: "Aluminum Angle Stock",
    category: "Mirror Cell",
    specification: '1" × 1" × 1/8" 6061 aluminum',
    quantity: 1,
    estimatedCost: "$20–30",
    status: "Needed",
    purchaseUrl: "https://www.onlinemetals.com/en/buy/aluminum/1-x-1-x-0-125-aluminum-angle-6061-t6-extruded-structural/pid/971",
  },
  {
    name: "Collimation Bolts",
    category: "Mirror Cell",
    specification: '1/4"-20 × 4" with knobs',
    quantity: 3,
    estimatedCost: "$15–25",
    status: "Needed",
    purchaseUrl: "https://www.scopestuff.com/",
  },
  {
    name: "Flotation Triangles",
    category: "Mirror Cell",
    specification: "CNC aluminum 9-point flotation",
    quantity: 3,
    estimatedCost: "$75–150",
    status: "Needed",
    notes: "Supports mirror without distortion",
    purchaseUrl: "https://www.astrogoods.com/cells.shtml",
  },
  {
    name: "Mirror Clips",
    category: "Mirror Cell",
    specification: "Spring-loaded retaining clips",
    quantity: 3,
    estimatedCost: "$10–15",
    status: "Needed",
    purchaseUrl: "https://www.scopestuff.com/",
  },
  {
    name: "RTV Silicone",
    category: "Mirror Cell",
    specification: "GE Silicone II clear",
    quantity: 1,
    estimatedCost: "$9–12",
    status: "Needed",
    purchaseUrl: "https://www.homedepot.com/p/GE-Advanced-Silicone-2-Caulk-10-1-oz-Kitchen-and-Bath-Sealant-Clear-2812562/317742602",
  },
  {
    name: "Rear Cooling Fan",
    category: "Mirror Cell",
    specification: "80mm 12V DC brushless",
    quantity: 1,
    estimatedCost: "$8–12",
    status: "Needed",
    notes: "Accelerates mirror thermal equilibrium",
    purchaseUrl: "https://www.amazon.com/GDSTIME-80mm-Brushless-Computer-Cooling/dp/B07WCLT27F",
  },
  {
    name: "Side Ventilation Fan",
    category: "Mirror Cell",
    specification: "60mm 12V DC brushless",
    quantity: 1,
    estimatedCost: "$7–10",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/CPU-Cooling-Fan-Computer-Connector/dp/B07B68H3JQ",
  },

  // ── Electronics ─────────────────────────────────────
  {
    name: "Raspberry Pi 4",
    category: "Electronics",
    specification: "Model B 4GB RAM",
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "Main computer — runs tracking, imaging, and web server",
    donatedBy: "Donated",
  },
  {
    name: "MicroSD Card",
    category: "Electronics",
    specification: "64GB Class 10 A2",
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    donatedBy: "Donated",
  },
  {
    name: "Ethernet Cable",
    category: "Electronics",
    specification: "Cat5e/Cat6, 3–5m",
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "Network connection for Pi",
    donatedBy: "Donated",
  },
  {
    name: "Pi Power Supply",
    category: "Electronics",
    specification: "USB-C 5V 3A official PSU",
    quantity: 1,
    estimatedCost: "$8–12",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Raspberry-Official-Power-Supply-15-3W/dp/B07YD2LZDC",
  },
  {
    name: "NEMA 23 Stepper (Altitude)",
    category: "Electronics",
    specification: "1.8° 1.2 N·m bipolar",
    quantity: 1,
    estimatedCost: "$18–22",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/STEPPERONLINE-Stepper-178-5oz-1-26Nm-Stepping/dp/B00PNEPF5I",
  },
  {
    name: "NEMA 23 Stepper (Azimuth)",
    category: "Electronics",
    specification: "1.8° 1.2 N·m bipolar",
    quantity: 1,
    estimatedCost: "$18–22",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/STEPPERONLINE-Stepper-178-5oz-1-26Nm-Stepping/dp/B00PNEPF5I",
  },
  {
    name: "NEMA 17 Stepper (Focus)",
    category: "Electronics",
    specification: "1.8° 0.4 N·m bipolar",
    quantity: 1,
    estimatedCost: "$11–16",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Stepper-56-2oz-2-Phase-Bipolar-Mounting/dp/B07L86RH8Z",
  },
  {
    name: "TMC2209 Stepper Drivers",
    category: "Electronics",
    specification: "Silent stepper drivers",
    quantity: 3,
    estimatedCost: "$18–22",
    status: "Needed",
    notes: "Ultra-quiet StealthChop for vibration-free tracking",
    purchaseUrl: "https://www.amazon.com/BIGTREETECH-TMC2209-Stepper-Stepstick-Motherboard/dp/B07ZPYKL46",
  },
  {
    name: "GT2 Timing Belts + Pulleys",
    category: "Electronics",
    specification: "6mm GT2 belt + 20T/60T pulleys",
    quantity: 2,
    estimatedCost: "$16–28",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Pnloog-Timing-Pulley-Reduction-Synchronous-Diameter/dp/B09GVC2Z8F",
  },
  {
    name: "12V Power Supply",
    category: "Electronics",
    specification: "12V 10A switching PSU",
    quantity: 1,
    estimatedCost: "$14–20",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/inShareplus-Universal-Regulated-Switching-Transformer/dp/B07RFGH2ZM",
  },
  {
    name: "Buck Converter",
    category: "Electronics",
    specification: "12V → 5V 3A DC-DC",
    quantity: 1,
    estimatedCost: "$7–12",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/DROK-Display-LM2596-Buck-Converter/dp/B0F6SKTP1P",
  },
  {
    name: "Inline Fuse Holder",
    category: "Electronics",
    specification: "15A blade fuse holder",
    quantity: 1,
    estimatedCost: "$7–10",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Automotive-Holder-Waterproof-Inline-Replacement/dp/B0BZZ4WYYV",
  },
  {
    name: "Terminal Block",
    category: "Electronics",
    specification: "12-position barrier strip",
    quantity: 1,
    estimatedCost: "$3–8",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Position-Screw-Barrier-Strip-Terminal/dp/B01B15M5SC",
  },
  {
    name: "Bulk Capacitors",
    category: "Electronics",
    specification: "100µF 25V electrolytic",
    quantity: 3,
    estimatedCost: "$5–7",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/BOJACK-25Voltage-Aluminum-Electrolytic-Capacitors/dp/B07SBW2SNR",
  },
  {
    name: "TVS Diodes",
    category: "Electronics",
    specification: "15V bidirectional TVS",
    quantity: 2,
    estimatedCost: "$7–10",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/SMBJ15CA-SMBJ15CA-E3-Bidirectional-Transient-Suppression/dp/B0BWF2G7QZ",
  },
  {
    name: "Wiring Kit",
    category: "Electronics",
    specification: "22AWG silicone wire assortment",
    quantity: 1,
    estimatedCost: "$12–16",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Electric-Flexible-Silicone-different-Electronic/dp/B07G2JWYDW",
  },
  {
    name: "Limit Switches",
    category: "Electronics",
    specification: "Micro limit switch with lever",
    quantity: 4,
    estimatedCost: "$8–12",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Waterproof-Momentary-Rotary-Roller-ME-8108/dp/B00RXXB54C",
  },
  {
    name: "MOSFETs",
    category: "Electronics",
    specification: "IRLZ44N logic-level N-channel",
    quantity: 2,
    estimatedCost: "$6–10",
    status: "Needed",
    notes: "PWM fan speed control",
    purchaseUrl: "https://www.amazon.com/BOJACK-IRLZ44N-IRLZ44NPBF-N-Channel-Transistor/dp/B0FH6T96BP",
  },
  {
    name: "Pull-up Resistors",
    category: "Electronics",
    specification: "10kΩ 1/4W",
    quantity: 4,
    estimatedCost: "$5–7",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Projects-100EP11410K0-10k-Resistors-Pack/dp/B07C93JL54",
  },
  {
    name: "Debounce Capacitors",
    category: "Electronics",
    specification: "100nF ceramic",
    quantity: 4,
    estimatedCost: "$6–9",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Addicore-0-1uF-Capacitor-Multilayer-Ceramic/dp/B00HPQOFR6",
  },
  {
    name: "Flyback Diodes",
    category: "Electronics",
    specification: "1N4007 rectifier",
    quantity: 2,
    estimatedCost: "$5–8",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/RLECS-100-Pack-Rectifier-Electronic-Component/dp/B07XDSJK1F",
  },

  // ── Camera ──────────────────────────────────────────
  {
    name: "ZWO ASI662MC",
    category: "Camera",
    specification: "2.1MP color CMOS, USB 3.0",
    quantity: 1,
    estimatedCost: "$149–179",
    status: "Needed",
    notes: "High-sensitivity planetary and deep-sky imaging (replaces discontinued ASI120MC-S)",
    purchaseUrl: "https://www.amazon.com/ZWO-ASI662MC-Megapixel-Astronomy-Astrophotography/dp/B0B4SYLGFS",
  },
  {
    name: "T-Ring Adapter",
    category: "Camera",
    specification: 'M42 to 1.25" nosepiece',
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/SVBONY-Extension-Compatible-Photography-Telescope/dp/B0114CGRP4",
  },
  {
    name: "USB 3.0 Cable",
    category: "Camera",
    specification: "Active 5m USB 3.0 extension",
    quantity: 1,
    estimatedCost: "$18–25",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Plugable-Extension-Adapter-Back-Voltage-Protection/dp/B076C91NNB",
  },

  // ── Accessories ─────────────────────────────────────
  {
    name: "Eyepiece",
    category: "Accessories",
    specification: '25mm Plössl 1.25"',
    quantity: 1,
    estimatedCost: "$28–35",
    status: "Needed",
    notes: "Visual observing at star parties",
    purchaseUrl: "https://www.amazon.com/GSO-1-25-Plossl-Eyepiece-25mm/dp/B006I0ILXO",
  },
  {
    name: "Finder Scope",
    category: "Accessories",
    specification: "Red-dot or 6×30 optical",
    quantity: 1,
    estimatedCost: "$15–20",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/SVBONY-Pointer-Celestron-Astronomical-Telescopes/dp/B072VGFTN5",
  },
  {
    name: "Light Shroud",
    category: "Accessories",
    specification: "Nylon ripstop fabric tube",
    quantity: 1,
    estimatedCost: "$86–107",
    status: "Needed",
    notes: "Blocks stray light between UTA and mirror box",
    purchaseUrl: "https://www.amazon.com/Explore-Scientific-Shroud-Truss-Tube/dp/B0758JNN7R",
  },
  {
    name: "Collimation Tool",
    category: "Accessories",
    specification: "Cheshire + sight tube combo",
    quantity: 1,
    estimatedCost: "$25–37",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/SVBONY-Collimating-Collimation-Newtonian-Reflector/dp/B092ZW9X9M",
  },
  {
    name: "Dew Heater Strip",
    category: "Accessories",
    specification: "Flexible resistive heater",
    quantity: 1,
    estimatedCost: "$25–35",
    status: "Needed",
    notes: "Prevents dew on secondary mirror",
    purchaseUrl: "https://www.amazon.com/Omegon-Secondary-Mirror-Heating-Strip/dp/B0799BZCWJ",
  },
  {
    name: "Shaft Coupler",
    category: "Accessories",
    specification: '5mm to 8mm flexible coupler',
    quantity: 1,
    estimatedCost: "$8–12",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Befenybay-Flexible-Coupling-Diameter-Aluminum/dp/B0843TFVWZ",
  },
];

export const categories: PartCategory[] = [
  "Optics",
  "Structure",
  "Bearings",
  "Mirror Cell",
  "Electronics",
  "Camera",
  "Accessories",
];

export function getBudgetRange(): { low: number; high: number } {
  let low = 0;
  let high = 0;
  for (const part of parts) {
    if (part.status === "Donated") continue;
    const match = part.estimatedCost.match(/\$(\d+)[–-](\d+)/);
    if (match) {
      low += parseInt(match[1], 10) * part.quantity;
      high += parseInt(match[2], 10) * part.quantity;
    }
  }
  return { low, high };
}

export function getPartsByCategory(category: PartCategory): Part[] {
  return parts.filter((p) => p.category === category);
}

export function getStatusCounts(): Record<PartStatus, number> {
  const counts: Record<PartStatus, number> = {
    Donated: 0,
    Ordered: 0,
    Needed: 0,
    Claimed: 0,
  };
  for (const part of parts) {
    counts[part.status]++;
  }
  return counts;
}
