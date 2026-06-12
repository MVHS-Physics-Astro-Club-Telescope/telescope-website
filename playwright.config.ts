import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the /observe, /request, /sponsors, /parts preview
 * pages plus the homepage. Tests run against a production build (next build
 * + next start) on port 3037, or an already-running server via
 * PLAYWRIGHT_BASE_URL.
 */
const PORT = Number(process.env.PORT || 3037);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        // Run e2e against a production build, NOT `next dev`. The dev server
        // compiles routes on demand and fires Fast Refresh page reloads
        // mid-test while shared chunks recompile, which randomly resets
        // client-component state and focus (e.g. the /request target picker).
        // `next start` serves the prebuilt, statically rendered pages with no
        // HMR, so interactions are deterministic.
        command: `npx next build && npx next start -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
