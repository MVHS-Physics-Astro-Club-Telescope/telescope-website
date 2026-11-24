import { test, expect, type Page } from "@playwright/test";
import { SCHEMATICS_SEEN_KEY } from "../../src/components/schematics/announcement";
import { SCHEMATIC_SHEETS } from "../../src/data/schematics";

/**
 * The one-time "schematics are done" announcement on the home page, and the
 * sheet viewer inside it. Uses the plain Playwright page (not ./fixtures) so
 * each test starts as a first-time visitor with empty storage.
 */

const HEADLINE = "Our schematics are done.";
/** Load, then an idle callback (2 s at most), then the 1.6 s first-visit delay. */
const FIRST_VISIT_TIMEOUT = 20_000;

const dialog = (page: Page) => page.getByRole("dialog", { name: HEADLINE });
const activePanel = (page: Page) => dialog(page).locator('[role="tabpanel"][data-active="true"]');
const seen = (page: Page) => page.evaluate((key) => window.localStorage.getItem(key), SCHEMATICS_SEEN_KEY);

async function markSeen(page: Page) {
  await page.addInitScript((key) => {
    if (window.location.protocol.startsWith("http")) window.localStorage.setItem(key, "1");
  }, SCHEMATICS_SEEN_KEY);
}

async function expectSheet(page: Page, index: number) {
  const tab = dialog(page).getByRole("tab", { name: SCHEMATIC_SHEETS[index].title, exact: true });
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(activePanel(page)).toHaveAttribute("aria-labelledby", (await tab.getAttribute("id"))!);
  await expect(
    activePanel(page).getByRole("img", { name: new RegExp(`^${SCHEMATIC_SHEETS[index].title} schematic`) }),
  ).toBeVisible();
  await expect(dialog(page)).toContainText(SCHEMATIC_SHEETS[index].caption);
}

/** The home page as a new visitor sees it, waiting for the announcement. */
async function firstVisit(page: Page) {
  await page.goto("/");
  await expect(dialog(page)).toBeVisible({ timeout: FIRST_VISIT_TIMEOUT });
}

test.describe("Schematics announcement", () => {
  test("appears on a first visit with the overview sheet drawn", async ({ page }) => {
    await firstVisit(page);
    await expect(dialog(page).getByRole("heading", { name: HEADLINE })).toBeVisible();
    await expectSheet(page, 0);
    await expect(dialog(page).getByRole("link", { name: /See it on GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/MVHS-Physics-Astro-Club-Telescope/telescope-electrical",
    );
  });

  test("closes on Escape and is remembered", async ({ page }) => {
    await firstVisit(page);
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    expect(await seen(page)).toBe("1");
  });

  test("closes on the close button", async ({ page }) => {
    await firstVisit(page);
    await dialog(page).getByRole("button", { name: "Close" }).click();
    await expect(dialog(page)).toBeHidden();
    expect(await seen(page)).toBe("1");
  });

  test("stays closed after a reload", async ({ page }) => {
    await firstVisit(page);
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();

    await page.reload({ waitUntil: "load" });
    // Longer than the whole first-visit wait (idle timeout + delay) after load.
    await page.waitForTimeout(4_500);
    await expect(dialog(page)).toHaveCount(0);
  });

  test("tabs, arrow keys and the prev/next buttons switch the sheet", async ({ page }) => {
    await firstVisit(page);
    const d = dialog(page);

    await d.getByRole("tab", { name: "HAT signals" }).click();
    await expectSheet(page, 2);

    // Roving focus inside the tab row: one press moves one tab and wraps.
    await page.keyboard.press("ArrowRight");
    await expectSheet(page, 3);
    await expect(d.getByRole("tab", { name: "Power and drivers" })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expectSheet(page, 0);
    await page.keyboard.press("End");
    await expectSheet(page, 3);

    await expect(d.getByRole("button", { name: "Next sheet" })).toBeDisabled();
    await d.getByRole("button", { name: "Previous sheet" }).click();
    await expectSheet(page, 2);
    await d.getByRole("button", { name: "Previous sheet" }).click();
    await d.getByRole("button", { name: "Previous sheet" }).click();
    await expectSheet(page, 0);
    await expect(d.getByRole("button", { name: "Previous sheet" })).toBeDisabled();

    // Left/Right anywhere else in the viewer flips sheets too.
    await d.getByRole("heading", { name: HEADLINE }).click();
    await page.keyboard.press("ArrowRight");
    await expectSheet(page, 1);
  });

  test("zooms in and fits back", async ({ page }) => {
    await firstVisit(page);
    const viewport = activePanel(page).locator("[data-zoomed]");
    await expect(viewport).toHaveAttribute("data-zoomed", "false");
    await expect(dialog(page).getByRole("button", { name: "Fit the sheet" })).toBeDisabled();

    await dialog(page).getByRole("button", { name: "Zoom in" }).click();
    await expect(viewport).toHaveAttribute("data-zoomed", "true");
    await dialog(page).getByRole("button", { name: "Fit the sheet" }).click();
    await expect(viewport).toHaveAttribute("data-zoomed", "false");

    await viewport.dblclick();
    await expect(viewport).toHaveAttribute("data-zoomed", "true");
  });

  test("the deep link reopens it for a returning visitor", async ({ page }) => {
    await markSeen(page);
    await page.goto("/#schematics");
    await expect(dialog(page)).toBeVisible({ timeout: 10_000 });
    await expectSheet(page, 0);

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    // Closing takes the hash off, so a reload doesn't reopen it.
    await expect(page).toHaveURL(/\/$/);
  });

  test("the footer link reopens it and focus returns to the link", async ({ page }) => {
    await markSeen(page);
    await page.goto("/");
    const link = page.getByRole("contentinfo").getByRole("link", { name: "Schematics" });
    await link.click();
    await expect(dialog(page)).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(link).toBeFocused();
  });

  test("the footer link on another page goes home and opens it", async ({ page }) => {
    await markSeen(page);
    await page.goto("/observe");
    await page.getByRole("contentinfo").getByRole("link", { name: "Schematics" }).click();
    await expect(page).toHaveURL(/\/#schematics$/);
    await expect(dialog(page)).toBeVisible({ timeout: 10_000 });
  });

  test("has no MVHS branding, in the copy or in any sheet", async ({ page, request }) => {
    await markSeen(page);
    await page.goto("/#schematics");
    await expect(dialog(page)).toBeVisible({ timeout: 10_000 });
    expect(await dialog(page).innerText()).not.toMatch(/MVHS/i);

    for (const sheet of SCHEMATIC_SHEETS) {
      const res = await request.get(sheet.src);
      expect(res.ok()).toBe(true);
      const svg = await res.text();
      expect(svg.startsWith("<svg")).toBe(true);
      expect(svg).not.toMatch(/MVHS/i);
    }
  });
});

test.describe("Schematics announcement, reduced motion", () => {
  // `reducedMotion` is a context option, not a top-level `use` one.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("fades in without scaling or sliding", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __transforms: string[] };
      w.__transforms = [];
      const watch = () => {
        const el = document.querySelector('[role="dialog"]');
        if (!el) return requestAnimationFrame(watch);
        const start = performance.now();
        const sample = () => {
          w.__transforms.push(getComputedStyle(el).transform);
          if (performance.now() - start < 600) requestAnimationFrame(sample);
        };
        sample();
      };
      requestAnimationFrame(watch);
    });
    await firstVisit(page);
    await page.waitForTimeout(700);
    const transforms = await page.evaluate(() => (window as unknown as { __transforms: string[] }).__transforms);
    expect(transforms.length).toBeGreaterThan(5);
    expect(new Set(transforms)).toEqual(new Set(["none"]));
  });
});
