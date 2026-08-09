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
  /** CAD render tile under /public/cad/parts/ */
  image?: string;
  purchaseUrl?: string;
}

export const parts: Part[] = [
  // ── Optics ──────────────────────────────────────────
  {
    name: "Primary Mirror",
    image: "/cad/parts/primary-mirror.png",
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
    image: "/cad/parts/secondary-mirror.png",
    category: "Optics",
    specification: "70mm minor axis elliptical flat",
    quantity: 1,
    estimatedCost: "$80",
    status: "Needed",
    purchaseUrl: "https://agenaastro.com/gso-elliptical-secondary-mirror-70-mm.html",
  },
  {
    name: "Spider + Secondary Holder",
    image: "/cad/parts/secondary-hub.png",
    category: "Optics",
    specification: "3-vane printed spider + collimating hub (ASA)",
    quantity: 1,
    estimatedCost: "$0",
    status: "Claimed",
    notes:
      "3D-printed in-house: Spider Vane v2 ×3, Hub Plate v2, collimating Secondary Hub v2 — see Onshape 'Projected Telescope Design v1'. Replaces Protostar purchase ($85–120 saved)",
  },
  {
    name: "Focuser",
    image: "/cad/parts/focuser-gso.png",
    category: "Optics",
    specification: '1.25" Crayford single-speed (GSO)',
    quantity: 1,
    estimatedCost: "$95",
    status: "Needed",
    notes: "Donated ToupTek AAF motor provides motorized fine focus",
    purchaseUrl: "https://agenaastro.com/gso-crayford-focuser-reflector-telescope-single-speed-1-25.html",
  },
  {
    name: "Flocking Material",
    category: "Optics",
    specification: "Self-adhesive black velour",
    quantity: 1,
    estimatedCost: "$13",
    status: "Needed",
    notes: "Lines the upper tube assembly to reduce stray light",
    purchaseUrl: "https://www.amazon.com/MINZIHAO-Flocking-Adhesive-100x48cm-Telescope/dp/B0DT6VHK1H",
  },

  // ── Structure ───────────────────────────────────────
  {
    name: "Cabinet-Grade Plywood",
    image: "/cad/parts/mirror-box.png",
    category: "Structure",
    specification: '3/4" cabinet-grade birch plywood (PureBond)',
    quantity: 1,
    estimatedCost: "$81",
    status: "Needed",
    notes: "Mirror box, rocker box, and ground board",
    purchaseUrl: "https://www.homedepot.com/p/Columbia-Forest-Products-3-4-in-x-4-ft-x-8-ft-PureBond-Birch-Plywood-165921/100077837",
  },
  {
    name: "Ground Board",
    image: "/cad/parts/ground-board.png",
    category: "Structure",
    specification: '3/4" plywood, 20" diameter',
    quantity: 1,
    estimatedCost: "$10–15",
    status: "Needed",
    purchaseUrl: "https://www.homedepot.com/p/Columbia-Forest-Products-3-4-in-x-4-ft-x-8-ft-PureBond-Birch-Plywood-165921/100077837",
  },
  {
    name: "Aluminum Tubes",
    image: "/cad/parts/truss-pole.png",
    category: "Structure",
    specification: '1" OD × 0.058" wall truss poles',
    quantity: 6,
    estimatedCost: "$104",
    status: "Needed",
    notes: '3× 72" lengths cut to six 635mm poles (6-pole / 3-pair truss)',
    purchaseUrl: "https://www.onlinemetals.com/en/buy/aluminum/1-od-x-0-058-wall-x-0-884-id-aluminum-round-tube-6061-t6-drawn/pid/4342",
  },
  {
    name: "Strut Connectors",
    image: "/cad/parts/pole-clamp.png",
    category: "Structure",
    specification: "3D-printed pole clamps (ASA)",
    quantity: 6,
    estimatedCost: "$0",
    status: "Claimed",
    notes: "Printed Truss Pole Clamp v2 ×6 — replaces Aurora CNC blocks ($40–80 saved)",
  },
  {
    name: "Truss Shoes",
    image: "/cad/parts/truss-shoe-skew.png",
    category: "Structure",
    specification: "3D-printed double-pocket pole shoes (ASA)",
    quantity: 3,
    estimatedCost: "$0",
    status: "Claimed",
    notes: "Printed in-house: 2× SKEW + 1× CENTER — bolt to mirror-box walls, receive the pole pairs",
  },
  {
    name: "Bearing Tower Plates",
    image: "/cad/parts/bearing-tower.png",
    category: "Structure",
    specification: "6mm 6061 plates, laser-cut (SendCutSend)",
    quantity: 2,
    estimatedCost: "$0 (sponsor credit)",
    status: "Needed",
    purchaseUrl: "https://sendcutsend.com",
    notes: "Carry the altitude bearing hubs above the box top; slotted holes give ±10mm balance adjustment",
  },
  {
    name: "Altitude Bearing Hubs",
    image: "/cad/parts/alt-hub.png",
    category: "Structure",
    specification: '2.75" OD × 2.375" 6061 round bar, faced + drilled',
    quantity: 2,
    estimatedCost: "$25–40",
    status: "Needed",
    notes: "EZ GOTO normally machines a GSO donor scope's bearing base — our scratch build fabricates its own; Romer offers free machining with the kit (confirm with them)",
  },

  {
    name: "Heat-Set Insert Kit",
    image: "/cad/parts/insert-m4.png",
    category: "Structure",
    specification: "Brass M2–M5 assortment (ruthex, 270 pc)",
    quantity: 1,
    estimatedCost: "$43",
    status: "Needed",
    notes: "All printed-part threads use inserts — self-tapped plastic threads do not survive rooftop thermal cycling",
    purchaseUrl: "https://www.amazon.com/ruthex-Bundle-Threaded-Assortment-Soldering/dp/B0FCXXW62N",
  },
  {
    name: "UTA Hardware Set",
    image: "/cad/parts/m4x50.png",
    category: "Structure",
    specification: "M4×50/M4×35 SS bolts, nuts, M3 collimation screws + compression springs, M5 threaded rod 1m",
    quantity: 1,
    estimatedCost: "$18–25",
    status: "Needed",
    notes: "Fastens ring joints, vane feet, pole clamps; springs load the secondary collimation cell",
  },
  {
    name: "ASA Filament",
    category: "Structure",
    specification: "1kg spool, black, UV-stable",
    quantity: 1,
    estimatedCost: "$18–24",
    status: "Needed",
    notes: "Final outdoor parts (PLA prototypes only — creeps above 55°C in rooftop sun)",
  },
  {
    name: "T-Nuts",
    image: "/cad/parts/t-nut.png",
    category: "Structure",
    specification: "1/4-20 pronged T-nuts",
    quantity: 16,
    estimatedCost: "$8–10",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/POWERTEC-QTN1102-Pronged-4-Inch-20-16-Inch/dp/B073XL2DQJ",
  },
  {
    name: "Dowel Pins",
    image: "/cad/parts/dowel-pin.png",
    category: "Structure",
    specification: '3/8" steel alignment pins',
    quantity: 16,
    estimatedCost: "$36",
    status: "Needed",
    notes: "2× POWERTEC 8-packs (16 pins)",
    purchaseUrl: "https://www.amazon.com/POWERTEC-71473-P2-Hardened-Precisely-Alignment/dp/B0C1RYN84B",
  },
  {
    name: "Hardware Box",
    category: "Structure",
    specification: "Assorted bolts, nuts, washers",
    quantity: 1,
    estimatedCost: "$27",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/dp/B09BLV6FCT",
  },
  {
    name: "Wood Glue + Finish",
    category: "Structure",
    specification: "Titebond III + polyurethane",
    quantity: 1,
    estimatedCost: "$34–36",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Titebond-1415-Ultimate-32-Ounce-Bottle/dp/B0002YQ3KU",
  },
  {
    name: "Paint",
    category: "Structure",
    specification: "Flat black interior",
    quantity: 1,
    estimatedCost: "$7",
    status: "Needed",
    notes: "Exterior gets polyurethane (see Wood Glue + Finish)",
    purchaseUrl: "https://www.amazon.com/Krylon-K05546007-COLORmaxx-Spray-Aerosol/dp/B07LFWTW93",
  },

  // ── Bearings ────────────────────────────────────────
  {
    name: "PTFE Altitude Pads",
    image: "/cad/parts/pad-alt.png",
    category: "Bearings",
    specification: '1" × 1.5" virgin PTFE (medium kit)',
    quantity: 4,
    estimatedCost: "$26",
    status: "Needed",
    notes: "Kit includes both altitude + azimuth pads; ships on backorder",
    purchaseUrl: "https://cloudbreakoptics.com/products/teflon-bearing-kits",
  },
  {
    name: "PTFE Azimuth Pads",
    image: "/cad/parts/pad-az.png",
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
    image: "/cad/parts/ebony-star.png",
    category: "Bearings",
    specification: "Wilsonart Ebony Star surface",
    quantity: 1,
    estimatedCost: "$90",
    status: "Needed",
    notes: 'Low-friction bearing surface — only a ~22" circle needed; a local laminate offcut beats the full-sheet price',
    purchaseUrl: "https://www.homedepot.com/p/Wilsonart-4-ft-x-8-ft-Laminate-Sheet-in-Ebony-Star-with-Premium-Textured-Gloss-Finish-4552K73504896/202840225",
  },
  {
    name: "Pivot Bolt",
    image: "/cad/parts/pivot-bolt.png",
    category: "Bearings",
    specification: '3/8"-16 × 3" stainless steel',
    quantity: 1,
    estimatedCost: "$9",
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
    image: "/cad/parts/knob-bolt.png",
    category: "Mirror Cell",
    specification: '1/4"-20 × 4" with knobs',
    quantity: 3,
    estimatedCost: "$15–20",
    status: "Needed",
    notes: 'POWERTEC 5-star thru-knobs + hardware-store 1/4-20 × 4" hex bolts',
    purchaseUrl: "https://powertecproducts.com/71072-5-star-thru-knob-1-4-inch-20-5-pack/",
  },
  {
    name: "Flotation Triangles",
    category: "Mirror Cell",
    specification: "6061 laser-cut 9-point triangles (SendCutSend)",
    quantity: 3,
    estimatedCost: "$0 (sponsor credit)",
    status: "Needed",
    notes: "Cut via SendCutSend $500 sponsor credit — see SCS Parts Plan doc",
    purchaseUrl: "https://sendcutsend.com",
  },
  {
    name: "Mirror Clips",
    image: "/cad/parts/mirror-clip.png",
    category: "Mirror Cell",
    specification: "Spring-loaded retaining clips",
    quantity: 3,
    estimatedCost: "$0 (from angle stock)",
    status: "Needed",
    notes: "Cut 3 clips from the 1×1×1/8 angle stock row",
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
    image: "/cad/parts/fan-80.png",
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
    image: "/cad/parts/fan-60.png",
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
    specification: "23HS30-2804S — 1.8° 1.9 N·m 2.8 A, 8 mm shaft",
    notes: "8 mm shaft matches the Romer ALT pinion 8 mm bore (previous pick was 6.35 mm — no fit)",
    image: "/cad/parts/nema23.png",
    category: "Electronics",
    quantity: 1,
    estimatedCost: "$28",
    status: "Needed",
    purchaseUrl: "https://www.omc-stepperonline.com/nema-23-bipolar-1-8deg-1-9nm-269oz-in-2-8a-3-2v-57x57x76mm-4-wires-23hs30-2804s",
  },
  {
    name: "NEMA 17 Stepper (Azimuth)",
    image: "/cad/parts/nema17.png",
    category: "Electronics",
    specification: '1.8° bipolar NEMA 17 (EZ GOTO az axis, 10" Dob)',
    quantity: 1,
    estimatedCost: "$15",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/STEPPERONLINE-Stepper-Bipolar-Connector-compatible/dp/B00PNEQKC0",
  },
  {
    name: "NEMA 17 Stepper (Focus)",
    category: "Electronics",
    specification: "1.8° 0.4 N·m bipolar",
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "Superseded by ToupTek AAF electronic auto-focuser",
    donatedBy: "ToupTek Astro",
    purchaseUrl: "https://www.amazon.com/Stepper-56-2oz-2-Phase-Bipolar-Mounting/dp/B07L86RH8Z",
  },
  {
    name: "ToupTek AAF Electronic Auto-focuser",
    category: "Electronics",
    specification: "Direct-drive focuser motor with USB control",
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "Replaces NEMA 17 + GT2 belt for focus drive",
    donatedBy: "ToupTek Astro",
  },
  {
    name: "DM542 Stepper Drivers",
    category: "Electronics",
    specification: "DM542 digital driver, 1/128 microstep",
    quantity: 2,
    estimatedCost: "$66 ($33 each)",
    status: "Needed",
    notes: "Per EZ GOTO guide — TMC2209 (2A RMS) is marginal for 2.8A NEMA 23",
    purchaseUrl: "https://www.amazon.com/STEPPERONLINE-1-0-4-2A-20-50VDC-Micro-step-Resolutions/dp/B06Y5VPSFN",
  },
  {
    name: "EZ GOTO Kit (Romer Optics)",
    category: "Electronics",
    specification: "GOTO main board + encoders + USB adapter",
    quantity: 1,
    estimatedCost: "$165 ($150 kit + $15 accessories)",
    status: "Needed",
    purchaseUrl: "https://romer-optics-llc.myshopify.com/collections/coma-fee-dobsonian/products/ez-goto-kit",
  },
  {
    name: "AZ/ALT Gears Kit (Romer Optics)",
    // ALT pinion ships with 8 mm (NEMA 23) or 5 mm (NEMA 17) bore — order the 8 mm variant.
    image: "/cad/parts/sector-gear.png",
    category: "Electronics",
    specification: '12" stainless ALT sector gear + AZ gear & belt (L2.5m, W10mm) + motor slides/brackets',
    quantity: 1,
    estimatedCost: "$113",
    status: "Needed",
    notes: "Bearing-base machining included when bought with the EZ GOTO kit",
    purchaseUrl: "https://romer-optics-llc.myshopify.com/collections/coma-fee-dobsonian/products/az-alt-gears-kit-for-ez-goto",
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
    estimatedCost: "Donated",
    status: "Donated",
    notes: "5V derivation handled by PPB Advance Gen 2 variable output",
    donatedBy: "Pegasus Astro",
    purchaseUrl: "https://www.amazon.com/DROK-Display-LM2596-Buck-Converter/dp/B0F6SKTP1P",
  },
  {
    name: "Pegasus Pocket Powerbox Advance Gen 2",
    category: "Electronics",
    specification: "12V power distribution + USB hub + dew control + env sensor",
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "Integrated power management — replaces terminal block, MOSFETs, and buck converter",
    donatedBy: "Pegasus Astro",
  },
  {
    name: "Inline Fuse Holder",
    category: "Electronics",
    specification: "15A blade fuse holder",
    quantity: 1,
    estimatedCost: "$5",
    status: "Needed",
    purchaseUrl: "https://www.amazon.com/Automotive-Holder-Waterproof-Inline-Replacement/dp/B0BZZ4WYYV",
  },
  {
    name: "Terminal Block",
    category: "Electronics",
    specification: "12-position barrier strip",
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "Distribution handled by Pegasus PPB Advance Gen 2",
    donatedBy: "Pegasus Astro",
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
    estimatedCost: "$6",
    status: "Needed",
    notes: "SMD DO-214AA — use through-hole 1.5KE15CA if hand-wiring",
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
    estimatedCost: "$7",
    status: "Needed",
    notes: "BUYGOO V-156-1C25 6-pack",
    purchaseUrl: "https://www.amazon.com/dp/B07D9C2B6J",
  },
  {
    name: "MOSFETs",
    category: "Electronics",
    specification: "IRLZ44N logic-level N-channel",
    quantity: 2,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "PWM control handled by PPB Advance Gen 2 dew heater outputs",
    donatedBy: "Pegasus Astro",
    purchaseUrl: "https://www.amazon.com/BOJACK-IRLZ44N-IRLZ44NPBF-N-Channel-Transistor/dp/B0FH6T96BP",
  },
  {
    name: "Pull-up Resistors",
    category: "Electronics",
    specification: "10kΩ 1/4W",
    quantity: 4,
    estimatedCost: "$1",
    status: "Needed",
    notes: "25-pack — combine with ProtoSupplies diode order",
    purchaseUrl: "https://protosupplies.com/product/resistor-10k-5/",
  },
  {
    name: "Debounce Capacitors",
    category: "Electronics",
    specification: "100nF ceramic",
    quantity: 4,
    estimatedCost: "$1",
    status: "Needed",
    notes: "Only 4 needed — buy singles",
    purchaseUrl: "https://www.addicore.com/products/0-1uf-100nf-capacitor-multilayer-ceramic-50v",
  },
  {
    name: "Flyback Diodes",
    category: "Electronics",
    specification: "1N4007 rectifier",
    quantity: 2,
    estimatedCost: "$2",
    status: "Needed",
    notes: "10-pack",
    purchaseUrl: "https://protosupplies.com/product/1n4007/",
  },

  // ── Camera ──────────────────────────────────────────
  {
    name: "ToupTek ATR585C Cooled Camera",
    category: "Camera",
    specification: "8.3MP Sony IMX585 cooled CMOS, USB 3.0",
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "Cooled deep-sky imaging camera with thermoelectric cooling",
    donatedBy: "ToupTek Astro",
  },
  {
    name: "ToupTek GPM462C Guide Camera",
    category: "Camera",
    specification: "2.1MP Sony IMX462 CMOS, USB 2.0, planetary/guiding",
    quantity: 1,
    estimatedCost: "Donated",
    status: "Donated",
    notes: "Autoguider for closed-loop tracking correction",
    donatedBy: "ToupTek Astro",
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
    estimatedCost: "$30",
    status: "Needed",
    notes: "Out of stock at Plugable — watch restock or sub Cable Matters active 5m (verify stock first)",
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
    specification: 'Stretch black nylon (ES 10" truss Dob)',
    quantity: 1,
    estimatedCost: "$100",
    status: "Needed",
    notes:
      'Blocks stray light between UTA and mirror box. Fit-check: our UTA ring OD is 337mm — confirm against ES 10" truss shroud before ordering',
    purchaseUrl: "https://explorescientific.com/products/dobsonian-shroud-for-10-truss-tube-dob",
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
    specification: "480mm 12V strip (SVBONY SV192)",
    quantity: 1,
    estimatedCost: "$25",
    status: "Needed",
    notes: "Prevents dew on secondary; 12V — runs off Pegasus PPBA dew output",
    purchaseUrl: "https://www.amazon.com/SVBONY-Heater-Warmer-Telescope-Diameter/dp/B08YJBCLT8",
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
    // estimatedCost is the LINE-ITEM TOTAL (a single tube of glue, a 50-pack
    // of T-nuts, the kit that contains all 4 PTFE pads, etc.), not per-unit
    // pricing. Quantity is informational — what we need on the build, not
    // how many separate purchases. Keep this aligned with the engineering
    // PDF's published budget.
    const range = part.estimatedCost.match(/\$(\d+)[–-](\d+)/);
    if (range) {
      low += parseInt(range[1], 10);
      high += parseInt(range[2], 10);
      continue;
    }
    const single = part.estimatedCost.match(/\$(\d+)/);
    if (single) {
      const v = parseInt(single[1], 10);
      low += v;
      high += v;
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
