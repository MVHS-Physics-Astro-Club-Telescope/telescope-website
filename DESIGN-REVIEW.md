# Design Review — Immersive Astrophysics Theme Phase 2

**Theme:** immersive-astro
**Date:** 2026-06-11
**Phase:** 2 / WOR-53

This review covers the five main routes after the Phase 2 redesign. Observations are grounded in the production screenshots in `screenshots/immersive/` across three viewport widths (375, 768, 1440px).

---

## Route: /

### Immersion
The home hero maintains the Phase 1 deep-space environment: canvas StarField, pointer-reactive nebula glow, and the parallax content layer. At 1440px (screenshots/immersive/home-1440.png) the full-screen immersive hero fills the viewport convincingly. At 375px (screenshots/immersive/home-375.png) the star density is appropriate and the glow layers don't clash with mobile readability. The deep-space cosmic wash gradient on the body is consistent across all widths.

### Animation quality and consistency
The scroll-indicator chevron at the bottom of the hero uses `animate-bounce` (disabled under reduced motion via the global CSS kill-switch). Hero CTA buttons now use `btn-starlight` / `btn-nebula` with aurora glow on hover — the gradient shift from cool-violet to nebula-indigo family is tonally consistent with the deep-space identity. No jarring transitions observed.

### Space/physics theme cohesion
The Newtonian deep-space color palette (starlight white → nebula indigo → aurora blue) carries through cleanly on the home page. The button migration eliminates the legacy warm-gray titanium palette that felt out of place against the navy backdrop. No deviations.

**Reduced motion:** StarField renders a single static frame; parallax and scroll-indicator bounce disabled; hero glow and CSS animations all suppressed by the `@media (prefers-reduced-motion: reduce)` block.

---

## Route: /observe

### Immersion
The hero section (screenshots/immersive/observe-1440.png, observe-768.png, observe-375.png) now uses ImmersiveHero with shootingStars enabled. At 1440px the two-column layout places the TelescopeHUD mount-control panel on the right — compass dial, elevation arc, and telemetry rows are all visible and legible. At 768px the layout stacks correctly with the HUD below the copy. At 375px the HUD stacks below the hero text cleanly without overflow. The hero glow and pointer-reactive nebula layer are consistent with the home page experience, reinforcing the shared interaction language.

### Animation quality and consistency
The TelescopeHUD needle and elevation tube use Framer Motion `animate` with 10-second easing transitions — tasteful and imperceptible rather than distracting. The pulsing status pills (TRACKING · SIM in blue, MOUNT · IDLE in orange) use the existing `.pulse-dot` class. The telemetry readout rows fade between targets with a 0.6s opacity transition. The Reveal wrappers on "What you'll see" cards and "How it works" steps produce gentle 0.7s scroll reveals with the project's canonical `[0.16, 1, 0.3, 1]` easing. All animations are consistent with the MockLiveView motion philosophy.

### Space/physics theme cohesion
The TelescopeHUD card uses the established `rounded-2xl bg-[#0D1219] border border-white/[0.08]` pattern. The mono-font telemetry chrome (uppercase tracking-[0.15em+]) matches MockLiveView's established style. Compass labels N/E/S/W in mono, aurora-colored needle — all coherent with the deep-space identity.

**Reduced motion:** HUD renders a static schematic (no slewing, no target transitions). Reveal animations are suppressed by `MotionConfig reducedMotion="user"`. StarField renders a static frame.

---

## Route: /sponsors

### Immersion
At 1440px (screenshots/immersive/sponsors-1440.png) the ImmersiveHero wraps the header area with star field and pointer glow. The SponsorConstellation diagram below the header shows a clear star-map band with nodes connected by thin aurora-colored lines and diffraction spikes on the brightest nodes. The static screenshot captures the fully-drawn constellation lines (since there's no scroll interaction in the screenshot tool). At 375px (screenshots/immersive/sponsors-375.png) the constellation SVG scales correctly and remains decorative without obscuring content. The `StatCounter` count-up on the three stats strip renders the green highlight on the cash-raised figure correctly.

### Animation quality and consistency
The constellation line drawing (pathLength 0→1 with stagger, ~1.6s total) is imperceptible in a static screenshot but confirmed in the production server. Sponsor card aurora hover treatment (`hover:shadow-[0_0_32px_rgba(147,197,253,0.08)]`) and `hover:border-[rgba(147,197,253,0.2)]` are consistent with the site's soft-glow language. Reveal delays on sponsor cards (0.06s per card) avoid the "waterfall" effect of large delays.

### Space/physics theme cohesion
The constellation pattern is an apt visual metaphor — sponsors as stars, connected by the threads of a shared mission. The aurora-colored nodes and lines (rgba(147,197,253)) match the site's established accent color. Node placement uses deterministic pseudo-random positions so the pattern is stable across refreshes.

**Reduced motion:** Constellation lines are fully drawn (no animation); star twinkle disabled; StatCounter animation would jump to final value (reduced-motion honors the IntersectionObserver but skips the rAF loop). Reveal suppressed.

---

## Route: /parts

### Immersion
At 1440px (screenshots/immersive/parts-1440.png) the ImmersiveHero wraps the "Bill of Materials" header. The OpticalBench SVG diagram appears directly below the hero, showing the Newtonian light path: truss tube outline, parabolic primary mirror labeled "PRIMARY · 254mm f/4.48", flat secondary at 45°, and "IMX585 SENSOR" camera box. The ray paths are visible as faint aurora-colored lines. At 375px (screenshots/immersive/parts-375.png) the diagram scales to full width and remains legible — labels are readable at small sizes. The PartsTable follows immediately, filling the page appropriately.

### Animation quality and consistency
The animated photons (framer-motion keyframe arrays along each ray segment, 4s loop, staggered by 1.2s per ray) are not captured in the static screenshot but confirmed in production. The slow-rotating orbital ring decoration in the bottom-right corner uses a 48s CSS animation — genuinely imperceptible as motion, more texture than animation. The decorative velocity matches the site's "almost-imperceptible" philosophy.

### Space/physics theme cohesion
The diagram directly visualizes what the parts being purchased will assemble into — strong semantic connection. Truss tube outlined in `rgba(255,255,255,0.09)`, mirror curves in aurora blue, photon paths in `rgba(147,197,253,0.9)` — all using the established deep-space palette. The diagram card uses the canonical surface-1 pattern.

**Reduced motion:** Static ray paths rendered as gradient lines with no photon circles moving. Orbital ring animation disabled. Reveal suppressed.

---

## Route: /request

### Immersion
At 1440px (screenshots/immersive/request-1440.png) the ImmersiveHero with shootingStars wraps the hero. The CoordinateGrid SVG is visible as a faint RA/Dec graticule overlaid behind the hero text — curved meridian lines, declination arcs, and mono tick labels (18h, +30°, etc.) at very low opacity. The drifting target reticle (crosshair + lock ring) is positioned centrally. The overall effect layers astronomical coordinate language directly into the target-request context. At 375px (screenshots/immersive/request-375.png) the graticule is visible but subtle enough not to compete with the headline text.

### Animation quality and consistency
The CoordinateGrid reticle drifts between three grid positions on a 12s easeInOut loop — at 3500ms wait the screenshot captures it at the initial position. The pulsing lock-ring uses `.pulse-dot`. The MockTargetPicker and Reveal wrappers are unchanged from their functional behavior. The staggered capture-category card reveals (0.08s per card) are consistent with the observe page step reveals.

### Space/physics theme cohesion
The RA/Dec coordinate grid is directly relevant — the request form is asking the telescope to point at celestial coordinates. The crosshair reticle reinforces the "lock on target" metaphor. Mono tick labels in the grid match the `font-mono uppercase tracking-[0.15em+]` telemetry language used across MockLiveView and TelescopeHUD. The disabled submit button's `btn-starlight` style is visually appropriate for a "locked until first light" CTA.

**Reduced motion:** Static grid with static reticle at initial position; no drift animation; lock-ring pulse disabled. Reveal suppressed. StarField renders a static frame.

---

verdict: PASS
