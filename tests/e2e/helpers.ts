import type { Page } from "@playwright/test";

/**
 * Navigate and wait for React hydration before interacting.
 *
 * Pages are server-rendered, so elements exist (and look actionable to
 * Playwright) before React attaches event handlers. Clicking or typing in
 * that window hits a dead UI. React 19 stamps __reactFiber$/__reactProps$
 * keys on DOM nodes during hydration — wait for them on a marker element
 * that lives inside a client component.
 */
export async function gotoHydrated(page: Page, path: string, marker: string) {
  await page.goto(path);
  await page.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    return !!el && Object.keys(el).some((k) => k.startsWith("__react"));
  }, marker);
}
