MV Physics & Astronomy Club — Telescope Project Website. An independent student project, not affiliated with or endorsed by Mountain View High School or the MVLA district. Built with Next.js, React 19, and Tailwind CSS 4. Showcases the club's project to build a 10-inch f/4.48 Truss-Tube Dobsonian telescope with autonomous tracking.

## Asset pipeline

Drive → CAD → code → site. Each layer has one canonical source:

| Layer | Canonical source | Notes |
|---|---|---|
| Team documents | Google Drive · **MV Telescope Project** (see `00 Project Hub` doc) | numbered folders, `_archive` for superseded files |
| Geometry | Onshape · **Projected Telescope Design v1** → `Assembly 1` | 204 placed components incl. all fasteners; rollback tag `pre-claude-review-checkpoint` |
| BOM data | `src/data/parts.ts` | every purchasable row's price/link verified against live vendor pages 2026-08-09 |
| Part renders | `public/cad/parts/*.png` | generated from Onshape STL exports (dark atlas tiles, ortho view) |
| Control software | [`auto_telescope`](https://github.com/MVHS-Physics-Astro-Club-Telescope/auto_telescope) | Pi-side scheduling + safety |

To refresh renders after CAD changes: export part STLs from Onshape, re-render tiles
(flat-shaded ortho, `#0E1526` background to match the site), and drop them in
`public/cad/parts/` keeping the same kebab-case names referenced by `parts.ts`.
