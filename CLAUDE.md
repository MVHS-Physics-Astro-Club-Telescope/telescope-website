# Telescope Website — Project Context

## What Is This?
MVHS Physics and Astronomy Club telescope website. Static site showcasing team, equipment specs, build timeline, and sponsorship information.

## Tech Stack
- Next.js 16.2.2, React 19.2.4, TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Vercel deployment

## GitHub
- Repo: MVHS-Physics-Astro-Club-Telescope/telescope-website
- Branch: main

## Key Files
- `app/` — Next.js pages and layout
- `components/` — UI components (Navbar, Hero, Team, Specs, PartsTable, Timeline, Sponsorship, Footer)
- `next.config.ts` — has `ignoreBuildErrors: true` (should be removed)

## Deployment
- Vercel deployment
- Git author email MUST be `soccerdude1812@gmail.com`

## Dev Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Known Issues
- Remove `ignoreBuildErrors: true` in next.config.ts before production

## Critical Rules
- Mobile-first responsive design
- Use shadcn/ui components — never inline styles
- All components in `components/ui/`
