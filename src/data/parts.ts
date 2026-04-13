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
    estimatedCost: "$35–55",
    status: "Needed",
  },
  {
    name: "Spider + Secondary Holder",
    category: "Optics",
    specification: "4-vane spider with adjustable holder",
    quantity: 1,
    estimatedCost: "$25–40",
    status: "Needed",
  },
  {
    name: "Focuser",
    category: "Optics",
    specification: '1.25" Crayford-style dual-speed',
    quantity: 1,
    estimatedCost: "$80–120",
    status: "Needed",
  },
  {
    name: "Flocking Material",
    category: "Optics",
    specification: "Self-adhesive black velour",
    quantity: 1,
    estimatedCost: "$15–25",
    status: "Needed",
    notes: "Lines the upper tube assembly to reduce stray light",
  },

  // ── Structure ───────────────────────────────────────
  {
    name: "Cabinet-Grade Plywood",
    category: "Structure",
    specification: '3/4" Baltic birch plywood sheets',
    quantity: 1,
    estimatedCost: "$40–55",
    status: "Needed",
    notes: "Mirror box, rocker box, and ground board",
  },
  {
    name: "Ground Board",
    category: "Structure",
    specification: '3/4" plywood, 20" diameter',
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
  },
  {
    name: "Aluminum Tubes",
    category: "Structure",
    specification: '1" OD × 0.058" wall truss poles',
    quantity: 8,
    estimatedCost: "$30–45",
    status: "Needed",
    notes: "Upper tube assembly truss structure",
  },
  {
    name: "Strut Connectors",
    category: "Structure",
    specification: "CNC aluminum clamp blocks",
    quantity: 16,
    estimatedCost: "$25–35",
    status: "Needed",
  },
  {
    name: "T-Nuts",
    category: "Structure",
    specification: "1/4-20 pronged T-nuts",
    quantity: 16,
    estimatedCost: "$5–8",
    status: "Needed",
  },
  {
    name: "Dowel Pins",
    category: "Structure",
    specification: '3/8" steel alignment pins',
    quantity: 16,
    estimatedCost: "$3–5",
    status: "Needed",
  },
  {
    name: "Hardware Box",
    category: "Structure",
    specification: "Assorted bolts, nuts, washers",
    quantity: 1,
    estimatedCost: "$15–20",
    status: "Needed",
  },
  {
    name: "Wood Glue + Finish",
    category: "Structure",
    specification: "Titebond III + polyurethane",
    quantity: 1,
    estimatedCost: "$15–20",
    status: "Needed",
  },
  {
    name: "Paint",
    category: "Structure",
    specification: "Flat black interior, satin exterior",
    quantity: 1,
    estimatedCost: "$8–12",
    status: "Needed",
  },

  // ── Bearings ────────────────────────────────────────
  {
    name: "PTFE Altitude Pads",
    category: "Bearings",
    specification: '1" × 2" virgin PTFE',
    quantity: 4,
    estimatedCost: "$8–12",
    status: "Needed",
    notes: "Smooth altitude motion on side bearings",
  },
  {
    name: "PTFE Azimuth Pads",
    category: "Bearings",
    specification: '1.5" × 2" virgin PTFE',
    quantity: 3,
    estimatedCost: "$5–8",
    status: "Needed",
  },
  {
    name: "Ebony Star Laminate",
    category: "Bearings",
    specification: "Wilsonart Ebony Star surface",
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
    notes: "Low-friction bearing surface",
  },
  {
    name: "Pivot Bolt",
    category: "Bearings",
    specification: '3/8"-16 × 3" stainless steel',
    quantity: 1,
    estimatedCost: "$3–5",
    status: "Needed",
  },

  // ── Mirror Cell ─────────────────────────────────────
  {
    name: "Aluminum Angle Stock",
    category: "Mirror Cell",
    specification: '1" × 1" × 1/8" 6061 aluminum',
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
  },
  {
    name: "Collimation Bolts",
    category: "Mirror Cell",
    specification: '1/4"-20 × 4" with knobs',
    quantity: 3,
    estimatedCost: "$5–8",
    status: "Needed",
  },
  {
    name: "Flotation Triangles",
    category: "Mirror Cell",
    specification: "CNC aluminum 9-point flotation",
    quantity: 3,
    estimatedCost: "$10–15",
    status: "Needed",
    notes: "Supports mirror without distortion",
  },
  {
    name: "Mirror Clips",
    category: "Mirror Cell",
    specification: "Spring-loaded retaining clips",
    quantity: 3,
    estimatedCost: "$5–8",
    status: "Needed",
  },
  {
    name: "RTV Silicone",
    category: "Mirror Cell",
    specification: "GE Silicone II clear",
    quantity: 1,
    estimatedCost: "$5–8",
    status: "Needed",
  },
  {
    name: "Rear Cooling Fan",
    category: "Mirror Cell",
    specification: "80mm 12V DC brushless",
    quantity: 1,
    estimatedCost: "$8–12",
    status: "Needed",
    notes: "Accelerates mirror thermal equilibrium",
  },
  {
    name: "Side Ventilation Fan",
    category: "Mirror Cell",
    specification: "60mm 12V DC brushless",
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
  },

  // ── Electronics ─────────────────────────────────────
  {
    name: "Raspberry Pi 4",
    category: "Electronics",
    specification: "Model B 4GB RAM",
    quantity: 1,
    estimatedCost: "$55–75",
    status: "Needed",
    notes: "Main computer — runs tracking, imaging, and web server",
  },
  {
    name: "MicroSD Card",
    category: "Electronics",
    specification: "64GB Class 10 A2",
    quantity: 1,
    estimatedCost: "$8–12",
    status: "Needed",
  },
  {
    name: "Pi Power Supply",
    category: "Electronics",
    specification: "USB-C 5V 3A official PSU",
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
  },
  {
    name: "NEMA 23 Stepper (Altitude)",
    category: "Electronics",
    specification: "1.8° 1.2 N·m bipolar",
    quantity: 1,
    estimatedCost: "$25–40",
    status: "Needed",
  },
  {
    name: "NEMA 23 Stepper (Azimuth)",
    category: "Electronics",
    specification: "1.8° 1.2 N·m bipolar",
    quantity: 1,
    estimatedCost: "$25–40",
    status: "Needed",
  },
  {
    name: "NEMA 17 Stepper (Focus)",
    category: "Electronics",
    specification: "1.8° 0.4 N·m bipolar",
    quantity: 1,
    estimatedCost: "$12–18",
    status: "Needed",
  },
  {
    name: "TMC2209 Stepper Drivers",
    category: "Electronics",
    specification: "Silent stepper drivers",
    quantity: 3,
    estimatedCost: "$15–24",
    status: "Needed",
    notes: "Ultra-quiet StealthChop for vibration-free tracking",
  },
  {
    name: "GT2 Timing Belts + Pulleys",
    category: "Electronics",
    specification: "6mm GT2 belt + 20T/60T pulleys",
    quantity: 2,
    estimatedCost: "$25–40",
    status: "Needed",
  },
  {
    name: "12V Power Supply",
    category: "Electronics",
    specification: "12V 10A switching PSU",
    quantity: 1,
    estimatedCost: "$20–30",
    status: "Needed",
  },
  {
    name: "Buck Converter",
    category: "Electronics",
    specification: "12V → 5V 3A DC-DC",
    quantity: 1,
    estimatedCost: "$8–12",
    status: "Needed",
  },
  {
    name: "Inline Fuse Holder",
    category: "Electronics",
    specification: "15A blade fuse holder",
    quantity: 1,
    estimatedCost: "$5–8",
    status: "Needed",
  },
  {
    name: "Terminal Block",
    category: "Electronics",
    specification: "12-position barrier strip",
    quantity: 1,
    estimatedCost: "$5–8",
    status: "Needed",
  },
  {
    name: "Bulk Capacitors",
    category: "Electronics",
    specification: "100µF 25V electrolytic",
    quantity: 3,
    estimatedCost: "$3–5",
    status: "Needed",
  },
  {
    name: "TVS Diodes",
    category: "Electronics",
    specification: "15V bidirectional TVS",
    quantity: 2,
    estimatedCost: "$2–4",
    status: "Needed",
  },
  {
    name: "Wiring Kit",
    category: "Electronics",
    specification: "22AWG silicone wire assortment",
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
  },
  {
    name: "Limit Switches",
    category: "Electronics",
    specification: "Micro limit switch with lever",
    quantity: 4,
    estimatedCost: "$5–8",
    status: "Needed",
  },
  {
    name: "MOSFETs",
    category: "Electronics",
    specification: "IRLZ44N logic-level N-channel",
    quantity: 2,
    estimatedCost: "$3–5",
    status: "Needed",
    notes: "PWM fan speed control",
  },
  {
    name: "Pull-up Resistors",
    category: "Electronics",
    specification: "10kΩ 1/4W",
    quantity: 4,
    estimatedCost: "$1–2",
    status: "Needed",
  },
  {
    name: "Debounce Capacitors",
    category: "Electronics",
    specification: "100nF ceramic",
    quantity: 4,
    estimatedCost: "$1–2",
    status: "Needed",
  },
  {
    name: "Flyback Diodes",
    category: "Electronics",
    specification: "1N4007 rectifier",
    quantity: 2,
    estimatedCost: "$1–2",
    status: "Needed",
  },

  // ── Camera ──────────────────────────────────────────
  {
    name: "ZWO ASI120MC-S",
    category: "Camera",
    specification: "1.2MP color CMOS, USB 3.0",
    quantity: 1,
    estimatedCost: "$100–150",
    status: "Needed",
    notes: "High-sensitivity planetary and deep-sky imaging",
  },
  {
    name: "T-Ring Adapter",
    category: "Camera",
    specification: 'M42 to 1.25" nosepiece',
    quantity: 1,
    estimatedCost: "$15–20",
    status: "Needed",
  },
  {
    name: "USB 3.0 Cable",
    category: "Camera",
    specification: "Active 5m USB 3.0 extension",
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
  },

  // ── Accessories ─────────────────────────────────────
  {
    name: "Eyepiece",
    category: "Accessories",
    specification: '25mm Plössl 1.25"',
    quantity: 1,
    estimatedCost: "$20–50",
    status: "Needed",
    notes: "Visual observing at star parties",
  },
  {
    name: "Finder Scope",
    category: "Accessories",
    specification: "Red-dot or 6×30 optical",
    quantity: 1,
    estimatedCost: "$20–40",
    status: "Needed",
  },
  {
    name: "Light Shroud",
    category: "Accessories",
    specification: "Nylon ripstop fabric tube",
    quantity: 1,
    estimatedCost: "$15–25",
    status: "Needed",
    notes: "Blocks stray light between UTA and mirror box",
  },
  {
    name: "Collimation Tool",
    category: "Accessories",
    specification: "Cheshire + sight tube combo",
    quantity: 1,
    estimatedCost: "$15–30",
    status: "Needed",
  },
  {
    name: "Dew Heater Strip",
    category: "Accessories",
    specification: "Flexible resistive heater",
    quantity: 1,
    estimatedCost: "$15–20",
    status: "Needed",
    notes: "Prevents dew on secondary mirror",
  },
  {
    name: "Shaft Coupler",
    category: "Accessories",
    specification: '5mm to 8mm flexible coupler',
    quantity: 1,
    estimatedCost: "$5–8",
    status: "Needed",
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
