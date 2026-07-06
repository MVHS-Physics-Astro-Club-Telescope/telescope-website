# Lessons — telescope-website

## [2026-07-05][ssr-float-hydration] SVG coordinates computed with trig cause hydration mismatches
- **Phase**: Star Atlas redesign (FundraisingProgress aperture ring)
- **Mistake**: Rendered `Math.cos/sin` results directly as SVG attributes; server and client serialized the floats at different precisions (e.g. `21.525351545630087` vs `"21.5253515456301"`), producing a React hydration error.
- **Root cause**: React compares attribute strings byte-for-byte; float→string conversion is not guaranteed identical across render passes.
- **Fix**: `.toFixed(2)` on all computed SVG coordinates so SSR and client markup are byte-identical.
- **Prevention**: Any computed numeric JSX attribute in a server-rendered component gets fixed precision.

## [2026-07-05][playwright-download-stalled] Playwright browser download stalls on this network
- **Phase**: e2e verification
- **Mistake**: Waited ~20 minutes on `npx playwright install chromium` (stuck at 448K), with and without sandbox.
- **Root cause**: cdn.playwright.dev download is throttled/blocked on this network — not a sandbox issue.
- **Fix**: Run the suite against system Chrome with a temporary config override setting `channel: "chrome"` in the project (config must live inside the repo so `@playwright/test` resolves). All 27 tests pass this way.
- **Prevention**: If `ms-playwright` cache is empty, go straight to `channel: "chrome"`; don't wait on the download.

## [2026-07-05][hmr-churn-freezes-browser] Don't browse `next dev` while agents write files
- **Phase**: visual QA during parallel subpage agents
- **Mistake**: Kept a Chrome tab on the dev server while 3 agents edited components; HMR recompile storms froze the renderer (CDP timeouts) and hung curl.
- **Fix**: Kill the dev server during multi-agent write phases; do visual QA against `next build && next start` afterward (also what the e2e config does, for the same determinism reason).
- **Prevention**: Visual QA on production builds; dev server only for single-writer iteration.

## [2026-07-05][react19-lint-rules] eslint-config-next 16 enforces new react-hooks rules
- **Phase**: home page rebuild
- **Mistake**: Wrote `setState` synchronously in effects (reduced-motion early paths) and assigned a ref during render — 4 lint errors.
- **Fix**: Route one-shot setState through `requestAnimationFrame` (duration-0 tick), sync refs inside `useEffect`.
- **Prevention**: In this repo, never call setState in an effect body and never touch refs at render time; the linter is set to error.

## [2026-07-06][framer-scroll-gotchas] framer-motion scroll APIs failed three ways; drive 3D from raw scrollY
- **Phase**: scroll-driven home page (since reverted, lesson stands)
- **Mistakes**: (1) `useScroll({ target })` silently fell back to whole-page progress for a sticky-pinned section. (2) `useTransform(value, inputRange, output)` freezes its ranges from the first render — updating them via state does nothing. (3) `useTransform(value, fn)` two-arg map form didn't update in v12 either.
- **Fix**: for canvas/3D work, read `window.scrollY` in the render loop against bounds cached on resize, damping one progress value. For DOM, prefer in-flow text over a sticky stage.
- **Prevention**: treat framer scroll+target as unverified in this repo; probe anything scroll-driven with a Playwright screenshot script at known scroll fractions early.

## [2026-07-06][pbr-mirror-black] PBR mirrors render black without a filled environment
- **Phase**: 3D telescope showcase (since reverted, lesson stands)
- **Mistake**: metalness-1/roughness-0.04 mirror rendered pitch black — faithfully reflecting an almost-empty Lightformer environment.
- **Fix**: large dim fill Lightformers (front wall + floor) give specular surfaces something to reflect; slight roughness (0.1) spreads the lobes.
- **Prevention**: any mirror/chrome material needs the environment designed around it, not just key lights.
