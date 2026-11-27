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

The home page shows the final CAD assembly of the instrument (2,088 parts, the 25 Nov 2026 design), not a drawing of it. The 70 bought parts that show from outside are rebuilt from their makers' drawings and product photos, with their real labels and logos laid on as decals: the StepperOnline 17HS19 motors, the ToupTek ATR585C camera and AAF autofocuser, the GSO focuser, the Hammond enclosure with its SEAFLO kill switch, igus cable chain, icotek glands, finder, guide scope and fan. The enclosure stays closed: the boards inside it are only placeholders in the CAD.

The model is built outside this repo by the realism pipeline in `~/Projects/telescope/realism` (local to the maintainer's Mac, not versioned; its README has the steps): `site_export.py` writes the articulated GLB and `src/components/telescope/anchors.json`, then `gltf-transform weld`, `simplify --ratio 0 --error 0.0002` and `draco --method edgebreaker --quantize-position 14 --quantize-texcoord 12 --quantize-normal 10` bring it to `public/models/telescope.glb` (about 3.6 MB, 790k triangles). The finishes it names are in `appearance.json`; the decal images are in `public/textures/decals/`; the Draco decoder is three's, copied to `public/draco/`.

- `model.ts`: the pose (tube 45° up), the anchors in scene coordinates, and `dressModel()`, which gives every mesh its finish from `appearance.json` (brushed maps on the aluminium) and sets the pose on the GLB's `alt` and `az_pivot` nodes.
- `TelescopeCanvas.tsx`: the photo-shoot rig: one warm key spot with soft shadows, a cool rim, a faint fill, a dim studio environment for reflections, a dark floor and fog.
- `choreography.ts`: one continuous Catmull-Rom camera path, written as orbits around the anchors: the power-box side, down to the rocker and bearings, onto the enclosure, up the focuser side to the camera, into the open end of the cage, then out to the bearing side. `spec.ts` holds the story layout (`SCREENS`), so the DOM beats and the camera waypoints share the same scroll positions.
- `TelescopeStory.tsx`: pins the canvas and reads scroll progress inside the frame loop; copy scrolls in normal flow over it.

To change the camera, edit the waypoints and check the beats with a screenshot pass at the scroll fractions `beatProgress()` reports (0, 0.219, 0.5, 0.781, 1 with the current layout; use `behavior: "instant"` scrolls), on desktop and on a phone. To change the instrument, re-run the realism pipeline and replace the GLB and `anchors.json` together. Reflections come from a CC0 photo-studio HDRI from Poly Haven (`public/hdr`), with its colour taken down to 25 % so the tarp and walls don't tint the aluminium. Earlier versions are in git history: the procedural studio drawing at `75977ee`, the first Onshape export at `e72f670`.

## Data

| File | What it is |
|---|---|
| `src/data/team.ts` | Roster and the public roles note under the crew grid |
| `src/data/sponsors.ts` | Sponsor ledger; cash totals are computed from it |
| `src/data/parts.ts` | BOM for the current design, rebuilt 2026-11-25 from the Orders tab of the "MV Astronomy Finance" sheet (each row carries its Orders ID); drives the build cost on `/` and `/parts` |
| `src/data/targets.ts` | Curated catalog for the request preview |
| `src/data/schematics.ts` | The four HAT schematic sheets in the home-page viewer: titles and captions here, drawings in `public/schematics/` |

The schematic drawings are exported from the `telescope-electrical` KiCad project and re-themed as warm line-work on black. To refresh them after the schematic changes, check out that repo and run `npm run export:schematics -- <path-to-telescope-electrical> <commit>`; it reads the commit with `git archive` (your checkout and its branch are left alone), needs KiCad 10's `kicad-cli` (set `KICAD_CLI` if it is not in `~/Applications/KiCad`), and rewrites `public/schematics/*.svg`, `src/data/schematics-export.json` and `src/data/schematics-text.json`. It leaves out the team-process text listed in the script (`SOURCE_EDITS` rewrites the "(owner: Ibrahim)" off the HAT signals title before plotting; `STRIP` drops the owners note and Owner fields on the overview) and stops if those strings aren't found exactly as expected, so reworded notes can't slip onto the site. Before dropping anything it checks every string KiCad plotted on every sheet, and stops if any hidden field, description or title-block comment is drawn, or if anything left mentions MVHS or an owner. It also stops on any colour or element it doesn't recognise. The SVGs draw their text as strokes, so `schematics-text.json` (not loaded by the site) records what each sheet says and the hash of the file written, and the e2e suite checks it. To show the announcement to every visitor again, bump the version in `SCHEMATICS_SEEN_KEY` (`src/components/schematics/announcement.ts`).

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
