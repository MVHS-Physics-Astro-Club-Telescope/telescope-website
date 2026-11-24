import { test as base, expect } from "@playwright/test";
import { SCHEMATICS_SEEN_KEY } from "../../src/components/schematics/announcement";

/**
 * The home page shows a one-time schematics announcement to new visitors.
 * Specs that are about something else start as a returning visitor who has
 * already seen it, so the dialog never sits over what they test.
 * `schematics.spec.ts` uses the plain `@playwright/test` page to get a first visit.
 */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript((key) => {
      // Init scripts also run in about:blank, which has no storage of its own.
      if (window.location.protocol.startsWith("http")) window.localStorage.setItem(key, "1");
    }, SCHEMATICS_SEEN_KEY);
    await provide(page);
  },
});

export { expect };
