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

`public/models/telescope.glb` is built from the club's Onshape assembly, not modelled by hand. The pipeline is `scripts/build-telescope-glb.mjs`:

1. Export from Onshape (document `6bf936e1f7347f3680c3534f`) with the translation API as glTF: `ASM 00 — FULL TELESCOPE`, plus the part studios whose ASM 00 instances are currently broken in the workspace (Mirror Box v3, Mirror Cell v2, Altitude Bearing Base, Fan 80mm). The direct `/gltf` endpoint returns 400 for this assembly; use `POST .../translations` with `formatName: "GLTF"` and download the `resultExternalDataIds`.
2. `node scripts/build-telescope-glb.mjs <dir-with-exports>` re-centres the UTA on the optical axis, composes the missing parts at their recorded occurrence transforms, builds the R285 sector gear and the 70 mm secondary flat, stamps a material family onto every node name (`plywood::Rocker Floor 450sq`), joins Onshape's per-face primitives, welds, simplifies (threads and vendor STEPs hardest), Draco-compresses, and writes the GLB plus `src/components/telescope/anchors.json` (world bounding boxes the camera choreography is keyed to).
3. `src/components/telescope/materials.ts` maps the family prefix to real PBR materials at load time; `choreography.ts` holds the camera keyframes; `TelescopeStory.tsx` pins the canvas and reads scroll progress in the frame loop.

Refresh after CAD changes: re-export, re-run the script, check the anchors and the four camera beats with a screenshot pass at scroll fractions 0 / 0.28 / 0.55 / 0.8 / 1.

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
