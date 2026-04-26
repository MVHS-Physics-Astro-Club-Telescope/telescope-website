import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config — minimal setup for the /observe and /request preview
 * pages plus the homepage. Webserver assumes the same port the rest of dev
 * uses (3037 — see package.json scripts) but tests can also run against an
 * already-running server via PLAYWRIGHT_BASE_URL.
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
        command: `PORT=${PORT} npx next dev --webpack`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
