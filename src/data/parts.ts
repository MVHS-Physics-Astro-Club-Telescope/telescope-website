export type PartStatus =
  | "Donated"
  | "Ordered"
  | "Needed"
  | "Claimed"
  | "Superseded";
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
  /** In-house fabrication method — rendered as a chip in the table */
  fab?: "3D Print" | "Laser Cut" | "Woodshop";
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
    name: "Spider + Secondary Holder v5/v6",
    fab: "3D Print",
    image: "/cad/parts/secondary-hub.png",
    category: "Optics",
    specification: "3 steel-blade vanes + hub plate + bonded-mirror holder (ASA)",
    quantity: 1,
    estimatedCost: "$5 (blades)",
    status: "Claimed",
    notes:
      "Vanes are now 0.80mm 304 stainless blades (139.5 × 14, laser cut, $1.77/ea at qty 3, $1.67 at qty 6) captured in printed end blocks — a third the thickness of the old printed blade, so a third the diffraction, ~18× the in-plane stiffness and no creep. Hub plate keys each block in a pocket so one bolt per end replaces two. Secondary Holder v6 bonds the mirror to a 45° cup on 3 silicone pads — no clamp across the optical face, no bolts in the light path — and collimates on 1 central M5 pull + 3 M4 push (springs deleted). Spider fastener count 10 → 7; holder 87 → 47 cm³",
  },
  {
    name: "Focuser",
    image: "/cad/parts/focuser-gso.png",
    category: "Optics",
    specification: '2" GSO Crayford + Agena Type-3 flat base plate (92×92×8, 76×76 bolts, Ø78.5 bore)',
    quantity: 1,
    estimatedCost: "$125–200",
    status: "Needed",
    notes:
      "The donated ToupTek AAF is a motor only — no drawtube, no base — so a mechanical focuser is still required; the AAF clamps to its 4.2mm knob shaft. The 1.25\" GSO was ruled out: its base is curved for a 176mm tube and GSO sells no flat plate for it. Focuser mount v5 is cut for the flat Type-3 plate. Stock check 2026-08-18: 2\" single-speed ($105) and dual-speed ($140) both out of stock at Agena, no ETA; in-stock substitute is the 2\" Linear Bearing Crayford dual-speed ($180, min height 78.6mm) + flat plate ($20)",
    purchaseUrl: "https://agenaastro.com/gso-crayford-focuser-reflector-telescope-single-speed-bundle.html",
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
    fab: "Woodshop",
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
    fab: "Woodshop",
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
    notes: '3× 72" lengths cut to six 686mm poles (6-pole / 3-pair truss)',
    purchaseUrl: "https://www.onlinemetals.com/en/buy/aluminum/1-od-x-0-058-wall-x-0-884-id-aluminum-round-tube-6061-t6-drawn/pid/4342",
  },
  {
    name: "Strut Connectors",
    fab: "3D Print",
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
    fab: "3D Print",
    image: "/cad/parts/truss-shoe-skew.png",
    category: "Structure",
    specification: "3D-printed double-pocket pole shoes (ASA)",
    quantity: 3,
    estimatedCost: "$0",
    status: "Claimed",
    notes: "Printed in-house: 2× SKEW + 1× CENTER — bolt to mirror-box walls, receive the pole pairs",
  },
  {
    name: "UTA Ring Segments v5",
    fab: "3D Print",
    image: "/cad/parts/ring-segment.png",
    category: "Structure",
    specification: "120° segments, Ø337/304, two variants: BOTTOM ×3 + TOP ×3 (ASA)",
    quantity: 6,
    estimatedCost: "$0",
    status: "Claimed",
    notes:
      "Split into BOTTOM (truss clamp stations) and TOP (vane station) so no segment carries a hole nothing bolts to. Staggered radial half-lap joint: outer wall continuous across the seam, faces butt hard, one M4 per joint clamps the lap into a friction joint — verified 0.0000 mm³ interference across a 3-segment ring, and nothing bridges, so the joint prints clean",
  },
  {
    name: "UTA Standoff v5",
    fab: "3D Print",
    category: "Structure",
    specification: "Ø14 × 109.25 pillar, M5 heat-set insert each end (ASA)",
    quantity: 3,
    estimatedCost: "$0",
    status: "Claimed",
    notes:
      "Sets the 109.25mm gap between the two UTA rings at the C stations. The M5 through-rod is gone — each ring bolts into the pillar's own threads with an M5×20, so there are no outer nuts or washers to lose",
  },
  {
    name: "Mirror Cell v2",
    fab: "3D Print",
    image: "/cad/parts/mirror-cell.png",
    category: "Mirror Cell",
    specification: "Ø272 printed cell, 3-point pads + collimation nut pockets",
    quantity: 1,
    estimatedCost: "$0",
    status: "Claimed",
    notes: "Printed in-house; SCS flotation triangles sit on top for 9-point support",
  },
  {
    name: "Focuser Board v4",
    fab: "3D Print",
    image: "/cad/parts/focuser-board.png",
    category: "Structure",
    specification: "110×100×8 board + 2 bolt bosses, Ø58 focuser bore (ASA)",
    quantity: 1,
    estimatedCost: "$0",
    status: "Claimed",
    notes:
      "Carries the GSO focuser outside the top UTA ring; plugs register in the ring wall sockets, held by 2× M4x35 + captive nuts",
  },

  {
    name: "Bearing Tower Plates",
    fab: "Laser Cut",
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
    specification: "Brass M2–M5 assortment (ruthex, 270 pc) + 7 heat-set tips ($42.99)",
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
    specification:
      "v5 ledger — 18-8 SS (McMaster, verified 2026-08-18): M4×16 ×12 (91292A118, 100/pk $11.63 — 6 ring joints + 6 vane blocks), M5×20 ×6 (91292A128, 100/pk $19.61 — standoffs), M4×50 ×6 (91292A140, 25/pk $8.56 — truss clamp bolts), Ø2.5×14 dowel pins ×6 (91585A297, 50/pk $13.85 — blade cross-pins), M4 ×12 for the truss pole clamps (length TBD — the clamp is not in the v5 CAD); heat-set inserts 6× M5 + 16× M4",
    quantity: 1,
    estimatedCost: "$30–40",
    status: "Needed",
    notes: "v5 deleted the threaded rods, collimation springs, M5 nuts and washers — the standoffs and ring joints now bolt straight into heat-set inserts. Do not order the v4 rod/spring/nut set",
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
    fab: "Laser Cut",
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
    specification: "23HS30-2804S2 — 1.8° 1.9 N·m 2.8 A, Φ8 mm × 22 mm shaft",
    notes:
      "Must be the -S2 variant: the plain 23HS30-2804S is Φ6.35 mm and will not fit the Romer ALT pinion, whose NEMA 23 option is an 8 mm bore. Verified 2026-08-18: $18.26, in stock",
    image: "/cad/parts/nema23.png",
    category: "Electronics",
    quantity: 1,
    estimatedCost: "$28",
    status: "Needed",
    purchaseUrl: "https://www.omc-stepperonline.com/nema-23-bipolar-1-9nm-269-06oz-in-2-8a-57x57x76mm-4-wires-8mm-shaft-23hs30-2804s2",
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
    estimatedCost: "—",
    status: "Superseded",
    notes: "Not purchased and not donated — the ToupTek AAF replaced the NEMA 17 + GT2 belt focus drive. Kept as a design record",
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
    name: "24V Motor-Rail PSU",
    category: "Electronics",
    specification: "24V 14.6A / 350W switching PSU (Mean Well LRS-350-24)",
    quantity: 1,
    estimatedCost: "$32",
    status: "Needed",
    notes:
      "24V, not 12V: the DM542 drivers require 20–50 VDC and will not run off a 12V rail, and the 2.8A/3.2V NEMA 23 needs the headroom for slew speed. This is the only mains-fed supply in the build — the 12V accessory rail is derived from it by the 24V→12V 10A step-down",
    purchaseUrl: "https://www.amazon.com/dp/B013ETVO12",
  },
  {
    name: "24V → 12V Step-Down (accessory rail)",
    category: "Electronics",
    specification: "15–40 VDC in → 12V 10A / 120W sealed buck, fused",
    quantity: 1,
    estimatedCost: "$20",
    status: "Needed",
    notes:
      "Feeds the Pegasus PPBA, which Pegasus's own manual says wants a ≥6A 12V supply. Measured rail load: ATR585C 12V/3.0A + SV192 dew strip 1.4A + 80mm & 60mm fans ~0.3A + PPBA USB hub (AAF + GPM462C, both 5V USB) ~0.7A ≈ 5.4A, ~6.7A if the Pi also runs off the PPBA instead of its own wall brick. 10A gives real headroom; a 3A LM2596 module does not clear the camera alone. Verified 2026-08-20: $19.99, in stock",
    purchaseUrl: "https://www.amazon.com/Converter-Transformer-Waterproof-Voltage-Reducer/dp/B08YYKSRJW",
  },
  {
    name: "LM2596 Buck Module",
    category: "Electronics",
    specification: "DROK LM2596, DC 4–32V in → 1.25–30V out, 3A max",
    quantity: 1,
    estimatedCost: "—",
    status: "Superseded",
    notes:
      "Never donated — this row was zeroed out when Pegasus sent the PPBA. Its 3A ceiling is below the ATR585C's 12V/3A draw on its own, so it cannot carry the accessory rail; use it only as a low-current bench tap if one is bought",
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
    estimatedCost: "—",
    status: "Superseded",
    notes: "Not needed and not donated — 12V distribution is handled by the Pegasus PPBA's four outputs",
    purchaseUrl: "https://www.amazon.com/Position-Screw-Barrier-Strip-Terminal/dp/B01B15M5SC",
  },
  {
    name: "Bulk Capacitors",
    category: "Electronics",
    specification: "220µF 50V 105°C electrolytic",
    quantity: 3,
    estimatedCost: "$8",
    status: "Needed",
    notes:
      "50V, not 25V: the rail is 24V, the LRS-350-24 trims to 28.8V, and stepper deceleration drives energy back up the rail above nominal. A 25V part has no margin. Mounted across V+/GND at each DM542, leads as short as possible, to absorb the driver's current gulps and the regenerative kick on decel. The third sits across the step-down's 24V input, which sees the same rail transients. Verified 2026-08-22: listing live",
    purchaseUrl: "https://www.amazon.com/105%C2%B0C-Electrolytic-Capacitor-Radial-10x12mm/dp/B010E9RF40",
  },
  {
    name: "TVS Diodes",
    category: "Electronics",
    specification: "1.5KE33CA — 33V bidirectional, 1500W, DO-201 through-hole",
    quantity: 2,
    estimatedCost: "$8",
    status: "Needed",
    notes:
      "33V, not 15V: a 15V TVS breaks down near 16.7V, so on the 24V rail it conducts continuously and destroys itself on first power-up. The 1.5KE33CA stands off 28.2V and clamps at 45.7V, which sits above the 28.8V PSU trim ceiling and below the DM542's 50V input limit. One across the 24V rail at each driver. Verified 2026-08-22: listing live",
    purchaseUrl: "https://www.amazon.com/20-Pieces-1-5KE33CA-DO-201AD-Bidirectional/dp/B079KJ7MXT",
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
    name: "Dew Heater RCA Adapter",
    category: "Electronics",
    specification: "RCA male \u2192 5.5\u00d72.1mm female, 12V",
    quantity: 1,
    estimatedCost: "$8\u201312",
    status: "Needed",
    notes:
      "Connector mismatch found 2026-08-24: the PPBA dew outputs are RCA female jacks (Pegasus manual \u00a74.5, 'RCA Female Jack / 5 Amps Each') but the SVBONY SV192 terminates in a 5.5\u00d72.1mm male plug. They do not mate. WATCH THE GENDER \u2014 most astro adapters sold are RCA-male-to-5.5\u00d72.1-MALE (for heaters with a female socket) and are the wrong part here. Needed: RCA male into the PPBA, 5.5\u00d72.1 FEMALE to accept the SV192's plug",
  },
  {
    name: "Fan Power Pigtails",
    category: "Electronics",
    specification: "5.5\u00d72.1mm male \u2192 3-pin fan header / bare lead, 12V",
    quantity: 2,
    estimatedCost: "$8\u201312",
    status: "Needed",
    notes:
      "Connector mismatch found 2026-08-24: the 80mm and 60mm PC fans terminate in 3-pin fan connectors, but every PPBA 12V and adjustable output is a 2.1mm DC barrel jack (Pegasus manual \u00a74.4 / \u00a74.7). One pigtail per fan. If a fan goes on a PWM dew channel instead, that one needs an RCA male end rather than 5.5\u00d72.1",
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
    estimatedCost: "—",
    status: "Superseded",
    notes: "Not needed and not donated — dew-heater PWM is handled by the Pegasus PPBA's two dew outputs",
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
    estimatedCost: "—",
    status: "Superseded",
    notes:
      "Orphaned with the IRLZ44N MOSFETs. These were the freewheel diodes across the fan and dew-heater loads back when a bare transistor switched them; the PPBA now drives both its quad 12V port and its two PWM dew outputs with its own protected MOSFETs. Nothing in the current design switches an inductive load with an unprotected transistor, so no external flyback is needed",
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
    if (part.status === "Donated" || part.status === "Superseded") continue;
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
    Superseded: 0,
  };
  for (const part of parts) {
    counts[part.status]++;
  }
  return counts;
}
