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

## [2026-08-09][amazon-price-verification] Amazon/StepperOnline prices need a real browser
- **Phase**: BOM price verification (feat/bom-verified-update)
- **Mistake**: Tried WebFetch on Amazon product pages — it returns only `<head>` metadata (title confirms the listing exists, but no price/stock). omc-stepperonline.com 403-blocks non-browser fetches entirely.
- **Root cause**: Both sites gate body content behind bot detection; the fetcher only gets the document head.
- **Fix**: Playwright MCP `browser_navigate` + `browser_snapshot`, then grep the snapshot YAML for `$`/`In Stock` lines. Snapshots land in `.playwright-mcp/` under the *parent* dir (`~/Projects/telescope/`), not the repo.
- **Prevention**: For price checks, go straight to the Playwright browser for Amazon/StepperOnline; WebFetch works fine for Shopify stores, Agena, and Explore Scientific.

## [2026-08-09][onshape-line-angle-planes] LINE_ANGLE cPlane semantics are hinge-direction-dependent
**Mistake:** Pocket cuts via LINE_ANGLE construction planes landed sideways/half-off — four different plane/extrude flip combinations all failed for a Y-axis hinge line.
**Root cause:** The angle parameter is measured from the vertical plane containing the hinge line for X-hinges (use 90−φ for a φ-from-vertical pocket), behaves differently for Y-hinges, and the sketch frame origin is not the global origin.
**Fix:** X-hinge lines with angle=90−φ work deterministically (probe-verified with marker holes + STL inspection); for a single tilted pocket where slop allows, a plain vertical bore + pinch-closure avoids tilted planes entirely.
**Prevention:** Never trust a tilted-plane cut on volume delta alone — direction-degenerate volumes match coincidentally (the clamp's sideways pocket matched the expected mm³ within 2%). Always render/STL-inspect any cut whose direction the volume can't distinguish.

## [2026-08-29][playwright-browser-version-mismatch] Playwright's bundled-browser check is version-pinned, not "any chromium"
- **Phase**: e2e verification for the independence-disclaimer branch
- **Mistake**: Assumed a populated `~/Library/Caches/ms-playwright/` meant the suite would run. All 39 tests failed with `Executable doesn't exist at .../chromium_headless_shell-1217/...` — the cache holds `chromium_headless_shell-1228`, but this repo's `@playwright/test` pins build 1217.
- **Root cause**: Playwright resolves an exact browser build number tied to the installed `@playwright/test` version; a newer cached build is not a substitute, and the error text reads like "no browsers installed".
- **Fix**: Same escape hatch as the 2026-07-05 download-stall lesson — a throwaway in-repo config that spreads the real one and swaps in `projects: [{ name: "chrome", use: { channel: "chrome" } }]`, run with `-c playwright.chrome.config.ts`, then delete it. 39/39 passed against system Chrome.
- **Prevention**: Read the *build number* in the "Executable doesn't exist" path before trying to install anything. If it differs from what's cached, go straight to `channel: "chrome"` — don't run `playwright install` on this network.

## [2026-09-05][onshape-gltf-direct-400] The assembly `/gltf` endpoint rejects this document; the translation API works
- **Phase**: exporting ASM 00 for the 3D home page
- **Mistake**: Three parameter variants of `GET /assemblies/d/…/e/…/gltf` (with and without tolerances, both Accept headers) all returned `400 An illegal argument was provided`.
- **Fix**: `POST /assemblies/…/translations` with `{formatName:"GLTF", storeInDocument:false, resolution:"medium"}`, poll `/translations/{id}` until `DONE`, download `resultExternalDataIds[0]` from `/documents/d/{did}/externaldata/{id}`. Same route works for part studios. Output is JSON glTF with a base64 buffer, Z-up, metres.
- **Prevention**: Go straight to the translation route for glTF; keep the direct endpoint for nothing.

## [2026-09-05][onshape-broken-instances-vanish] Broken assembly instances are silently omitted from the export
- **Mistake**: The exported ASM 00 had no mirror box, no mirror cell, no altitude hubs, no sector gear, and the model looked "almost right" for a while — the primary mirror floated in a rocker box.
- **Root cause**: Students regenerated those part studios (Sept 1); the ASM 00 instances now carry `partId: ""` (and the Mirror Box v2 instance has no element at all). Not hidden, not suppressed — just unresolvable, so the exporter drops them without a warning. The UTA sub-assembly is also placed 115 mm off the optical axis in X and Y.
- **Fix**: `scripts/build-telescope-glb.mjs` composes the missing parts from their own studio exports at the occurrence transforms ASM 00 still records, and shifts the UTA back onto the axis. Flagged to Eeshan for the CAD leads.
- **Prevention**: After any export, diff `rootAssembly.instances` (count, names, empty `partId`) against the glTF node list before trusting the model.

## [2026-09-05][per-face-primitives-block-simplify] Onshape glTF splits every part into per-face primitives; join before simplifying
- **Mistake**: `simplifyPrimitive` with aggressive ratios barely moved the count (794k → 708k). Each threaded screw was 200+ tiny primitives of a few hundred triangles that the size-class rules skipped.
- **Fix**: assign one material per mesh, strip `TEXCOORD_0` from everything but the textured plywood so attributes match, `joinPrimitives(mesh.listPrimitives())`, then weld and simplify. 794k → 97k unique triangles, 2.8M → 230k rendered, 450 KB Draco GLB.
- **Prevention**: Run `gltf-transform inspect` and look at `meshPrimitives` per mesh before designing any simplification pass.

## [2026-09-05][smooth-scroll-screenshots] `scroll-behavior: smooth` skews scripted screenshots
- **Mistake**: Playwright `window.scrollTo(0, y)` followed by a 1.8 s wait produced screenshots one beat late — the first "f=0" frame showed the mechanical beat.
- **Root cause**: the site sets `html { scroll-behavior: smooth }`; each scrollTo animates from the previous position and the story's camera damping compounds it.
- **Fix**: `window.scrollTo({ top, behavior: "instant" })` in scripts; log `window.scrollY` next to the requested value.
- **Prevention**: Any scripted scroll capture on this site passes `behavior: "instant"` and asserts the achieved scrollY.

## [2026-09-05][photo-textured-pcb] A real photograph beats any free Pi model

**Mistake:** Modelled the Raspberry Pi from primitives (three passes) and then went looking for a "real" glTF; every free Sketchfab/GitHub Pi 4 is untextured CAD.
**Root cause:** PCB realism is almost entirely the silkscreen/trace/pad texture, which no free mesh carries.
**Fix:** Rectify a high-res CC photo (Commons, `Raspberry Pi 4 Model B - Top.jpg`) with a homography through the four mounting holes (known mm positions), then map the photo by *position* onto the PCB cap and the +z face of each package box (`photoUV()` in `PiBoard.tsx`); derive roughness/metalness (ORM) and a normal map from the photo.
**Prevention:** For any real product in the scene, look for a rectifiable photo before a mesh. Two gotchas: (1) a board built with local +x → world +x and viewed from −z is *mirrored* — rotate the group π about y; (2) mm rectangles measured on a 5 mm grid overlay are accurate enough (±0.3 mm) for package footprints.

## [2026-09-05][react-hooks-immutability] Never mutate hook results in render or in useFrame

**Mistake:** Set `texture.colorSpace` inside `useMemo` and `material.opacity` inside `useFrame` on an object returned by `useMemo`; `react-hooks/immutability` fails lint (also on `main`'s `TelescopeCanvas.tsx`).
**Root cause:** The React compiler lint treats hook return values and hook-callback captures as frozen.
**Fix:** Configure textures in drei's `useTexture(urls, onLoad)` callback (it runs in a layout effect before the GPU upload); keep per-frame mutable objects behind `useRef` (`lid.current.opacity = …`, `<meshStandardMaterial ref={act} />`).
**Prevention:** Run `npm run lint` before every PR, not just `eslint <changed dirs>`.

## [2026-09-05][three-soft-shadows] three r185 deprecates PCFSoftShadowMap

**Mistake:** `<Canvas shadows="soft">` logged `PCFSoftShadowMap has been deprecated` on every frame.
**Root cause:** three 0.185 removed the soft variant; `shadow-radius` only ever applied to `PCFShadowMap`/VSM anyway.
**Fix:** `shadows="percentage"` (PCF) with `shadow-radius` on the key light.
**Prevention:** Read the browser console in the screenshot pass, not only the terminal.

## [2026-09-05][reduced-motion-scroll-story] Don't freeze a scroll-driven scene under prefers-reduced-motion

**Mistake:** The story camera held the hero framing whenever `prefers-reduced-motion: reduce` was on. Eeshan has macOS "Reduce motion" enabled, so on his own Mac the scroll story "wasn't working" while every headless capture looked fine.
**Root cause:** Treated scroll-linked camera travel like autoplay animation. It is user-driven; the setting is meant to remove motion the user did not initiate.
**Fix:** The camera always follows scroll; under reduced motion it tracks 1:1 (no easing), the LED flicker holds steady, and framer-motion's `reducedMotion="user"` still makes the copy appear without transitions.
**Prevention:** Before verifying "works for me", run one capture with `page.emulateMedia({ reducedMotion: "reduce" })` — and when someone says a page is broken, check their `matchMedia` flags first.

## [2026-09-05][stale-next-start] `pkill -f "next start"` does not kill `next start`

**Mistake:** Rebuilt `.next` while an old `next start` (process name `next-server`) was still bound to :3037; the new server failed with EADDRINUSE, the old one served a rebuilt directory, `/` returned 500, and two home-page e2e tests "timed out" and looked like a renderer crash.
**Root cause:** The server process's command line no longer contains "next start", so the pkill pattern misses it.
**Fix:** Stop servers by port: `lsof -ti :3037 | xargs kill`, and check `start.log` for `EADDRINUSE` before trusting a run.
**Prevention:** Any e2e failure that appears only on the heavy page: first `curl -s -o /dev/null -w "%{http_code}" http://localhost:3037/`.
