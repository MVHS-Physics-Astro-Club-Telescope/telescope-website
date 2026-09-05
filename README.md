MV Astronomy — the website for an independent student project in Mountain View, California, building a 10-inch f/4.48 truss-tube Dobsonian with autonomous tracking. Not affiliated with or endorsed by Mountain View High School or the MVLA district. Built with Next.js 16, React 19, Tailwind CSS 4, and react-three-fiber.

## Pages

| Route | Purpose |
|---|---|
| `/` | Scroll-driven 3D story of the real telescope (mechanical → electrical → optics → public observatory), then the crew and how to support the build |
| `/sponsors` | Every sponsor that has given cash, equipment, fabrication, materials, or services |
| `/parts` | The full bill of materials, filterable by category |
| `/observe` | Live-view preview: tonight's sky over Mountain View, plus a first-light notification form |
| `/request` | Target-request preview: filter chips, ⌘K catalog palette, locked submit, notification form |

## The 3D telescope

The home page renders an idealised version of the instrument, drawn the way a finished, well-made telescope looks under one studio spotlight. It is not a CAD export: `src/components/telescope/IdealTelescope.tsx` builds it from primitives (rounded plywood slabs, a rocker with a cradle top edge and a lightening hole, laminate-rimmed bearing arcs, a flocked mirror box, brushed-aluminium poles with thumb-knob clamps, a baffled cage, a front-surface primary, a 45° secondary flat, focuser and camera, drive and control box) using the dimensions in `spec.ts`, which follow the real build (254 mm f/4.48, 6-pole truss, 360 mm mirror box, 508 mm ground board). The plywood is a photographed maple veneer (diffuse, normal, roughness) and the reflections come from a real photo-studio HDRI; both are CC0 from Poly Haven and live in `public/textures` and `public/hdr`.

- `materials.ts` — one material per surface family (varnished birch, aluminium, powder-coat black, mirror, glass, rubber, LED, floor).
- `TelescopeCanvas.tsx` — the photo-shoot rig: one warm key spot with soft shadows, a cool rim, a faint fill, a low environment for reflections, a dark floor and fog.
- `choreography.ts` — one continuous Catmull-Rom camera path (position and look-target) around the instrument: front → low around the rocker → behind to the drive → up the left side into the cage → back out. `spec.ts` also holds the story layout (`SCREENS`), so the DOM beats and the camera waypoints share the same scroll positions.
- `TelescopeStory.tsx` — pins the canvas and reads scroll progress inside the frame loop; copy scrolls in normal flow over it.

To change the instrument, edit `spec.ts` or the component and check the beats with a screenshot pass at the scroll fractions `beatProgress()` reports (0, 0.227, 0.5, 0.773, 1 with the current layout; use `behavior: "instant"` scrolls). A CAD-derived version built from the Onshape assembly exists in git history at `e72f670` if it is ever wanted again.

## Data

| File | What it is |
|---|---|
| `src/data/team.ts` | Roster and the public roles note under the crew grid |
| `src/data/sponsors.ts` | Sponsor ledger; cash totals are computed from it |
| `src/data/parts.ts` | BOM; prices and links verified against vendor pages 2026-08-09 |
| `src/data/targets.ts` | Curated catalog for the request preview |

Donor truth lives in three places (club Gmail, `parts.ts` `donatedBy`, `sponsors.ts`); cross-check all three before calling the sponsor list complete.

## Develop

```bash
npm run dev            # http://localhost:3000
npm run build && npm start
npm run lint
npm run test:e2e       # Playwright against a production build on :3037
```

If Playwright's bundled Chromium is missing or the wrong build, run the suite with system Chrome via a throwaway config that sets `projects: [{ name: "chrome", use: { channel: "chrome" } }]` (see `lessons/lessons.md`).

## Deploy

Vercel deploys `main` to https://www.mvhsastro.org. `main` is protected; a solo PR merges with `gh pr merge <n> --squash --admin`.
