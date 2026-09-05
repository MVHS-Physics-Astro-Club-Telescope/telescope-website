# Telescope Website — Project Context

## What Is This?
MV Astronomy's website: an independent student project in Mountain View building a 10-inch autonomous Dobsonian. Five pages: a scroll-driven 3D story of the real telescope on `/`, then `/sponsors`, `/parts`, `/observe`, `/request`.

The project is presented as an **independent student project** — not affiliated with, endorsed by, or sponsored by Mountain View High School or the MVLA district. Public-facing copy says "MV", never "MVHS". The only permitted "mvhs" strings are live external identifiers that cannot be renamed from this repo: the contact email, the Instagram handle, the GitHub org path, and the SendCutSend credit code. `tests/e2e/disclaimers.spec.ts` enforces this and the roles note under the crew grid.

## Tech Stack
- Next.js 16.2.2, React 19.2.4, TypeScript, Tailwind CSS v4
- three / @react-three/fiber / @react-three/drei for the home-page telescope
- @gltf-transform (dev) for the model pipeline in `scripts/build-telescope-glb.mjs`
- Vercel deployment

## Design
One black room, one instrument, one warm light on it. Instrument Serif for display, Instrument Sans for copy, IBM Plex Mono only for numbers. No cards, no chart lines, no gradients beyond the single glow behind the telescope. Tokens and the few shared classes (`.label`, `.btn`, `.field`, `.row`, `.link`) live in `src/app/globals.css`.

## Key Files
- `src/app/*/page.tsx` — the five pages
- `src/components/telescope/` — canvas, materials, choreography, anchors
- `src/components/` — Navbar, Footer, Crew, Support, PartsTable, EmailSignup, MockTargetPicker, TonightAtMV, OfflineStatus
- `src/data/` — team, sponsors, parts, targets
- `public/models/telescope.glb` — built, never hand-edited; see README for the pipeline

## GitHub
- Repo: MVHS-Physics-Astro-Club-Telescope/telescope-website
- Branch: main (protected; solo merges need `--admin`)

## Deployment
- Vercel from `main` → https://www.mvhsastro.org
- Git author email MUST be `soccerdude1812@gmail.com`

## Dev Commands
- `npm run dev` / `npm run build` / `npm run lint` / `npm run test:e2e`

## Rules
- Mobile-first; check the home story on a phone viewport after any camera or copy change.
- Keep `src/data/team.ts` `leadershipNote` in sync with the roster; both are public statements.
- Read `lessons/lessons.md` before touching scroll, 3D, Playwright, or Onshape export code.
