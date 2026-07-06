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
