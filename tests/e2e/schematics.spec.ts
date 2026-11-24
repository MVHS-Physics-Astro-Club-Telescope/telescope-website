import { createHash } from "node:crypto";
import { test, expect, type Page } from "@playwright/test";
import { SCHEMATICS_SEEN_KEY } from "../../src/components/schematics/announcement";
import { SCHEMATIC_SHEETS } from "../../src/data/schematics";
import sheetText from "../../src/data/schematics-text.json";

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

/** Waits out the entrance, so measured boxes are where they stay. */
async function settledDialog(page: Page) {
  await expect.poll(() => dialog(page).evaluate((el) => getComputedStyle(el).transform)).toBe("none");
}

type View = { s: number; x: number; y: number };

/** The active sheet's pan and zoom, read from its transform once it stops changing. */
async function settledView(page: Page): Promise<View> {
  const drawing = activePanel(page).locator("[data-zoomed] > div");
  let last = "";
  for (;;) {
    const now = await drawing.evaluate((el) => (el as HTMLElement).style.transform);
    if (now === last) {
      const m = now.match(/translate\((-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)/);
      if (!m) throw new Error(`unexpected transform "${now}"`);
      return { x: Number(m[1]), y: Number(m[2]), s: Number(m[3]) };
    }
    last = now;
    await page.waitForTimeout(150);
  }
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

  test("counts as seen once it opens, even if never closed", async ({ page }) => {
    await firstVisit(page);
    expect(await seen(page)).toBe("1");

    await page.reload({ waitUntil: "load" });
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

  test("quick zoom clicks each zoom a full step", async ({ page }) => {
    await firstVisit(page);
    await settledDialog(page);
    const zoomIn = dialog(page).getByRole("button", { name: "Zoom in" });
    await zoomIn.click();
    const step = (await settledView(page)).s;
    await dialog(page).getByRole("button", { name: "Fit the sheet" }).click();
    expect((await settledView(page)).s).toBe(1);

    // The second click lands while the first zoom is still animating.
    await zoomIn.click();
    await zoomIn.click();
    expect((await settledView(page)).s).toBeCloseTo(step * step, 3);
  });

  test("quick arrow presses each pan a full step", async ({ page }) => {
    await firstVisit(page);
    await settledDialog(page);
    const zoomIn = dialog(page).getByRole("button", { name: "Zoom in" });
    await zoomIn.click();
    await settledView(page);
    await zoomIn.click();
    const before = await settledView(page);
    // Room for three steps before the right edge (ArrowRight moves the drawing left).
    const minX = await activePanel(page)
      .locator("[data-zoomed]")
      .evaluate((vp, s) => vp.clientWidth - (vp.firstElementChild as HTMLElement).offsetWidth * s, before.s);
    expect(before.x - minX).toBeGreaterThan(400);

    // Focus stays on the zoom button, so the keys reach the viewer, not the tabs.
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
    const after = await settledView(page);
    expect(after.s).toBeCloseTo(before.s, 3);
    expect(after.x - before.x).toBeCloseTo(-360, 0);
    expect(after.y).toBeCloseTo(before.y, 0);
  });

  test("wheel zoom in the middle of a drag carries on from the new zoom", async ({ page }) => {
    await firstVisit(page);
    await settledDialog(page);
    await dialog(page).getByRole("button", { name: "Zoom in" }).click();
    await settledView(page);
    const box = (await activePanel(page).locator("[data-zoomed]").boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 40, y, { steps: 4 });
    await page.mouse.wheel(0, -120);
    const zoomed = await settledView(page);
    await page.mouse.move(x + 70, y, { steps: 3 });
    const dragged = await settledView(page);
    await page.mouse.up();

    // Same zoom, and the drawing followed the pointer the last 30 px.
    expect(dragged.s).toBeCloseTo(zoomed.s, 3);
    expect(dragged.x - zoomed.x).toBeCloseTo(30, 0);
    expect(dragged.y).toBeCloseTo(zoomed.y, 0);
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

  test("has no MVHS branding or owner notes, in the copy or on any sheet", async ({ page, request }) => {
    await markSeen(page);
    await page.goto("/#schematics");
    await expect(dialog(page)).toBeVisible({ timeout: 10_000 });
    expect(await dialog(page).innerText()).not.toMatch(/MVHS/i);

    // The sheets draw their text as strokes, with no <text> to search. The
    // export records what each one says and the hash of the file it wrote, so
    // check the record and that it describes the file the site serves.
    expect(sheetText.sheets.map((s) => s.slug)).toEqual(SCHEMATIC_SHEETS.map((s) => s.slug));
    for (const sheet of SCHEMATIC_SHEETS) {
      const res = await request.get(sheet.src);
      expect(res.ok()).toBe(true);
      const svg = await res.body();
      expect(svg.toString("utf8").startsWith("<svg")).toBe(true);
      expect(svg.toString("utf8")).not.toMatch(/<text\b/);
      const record = sheetText.sheets.find((s) => s.slug === sheet.slug)!;
      expect(createHash("sha256").update(svg).digest("hex"), `${sheet.src} is the file in schematics-text.json`).toBe(
        record.sha256,
      );
      expect(record.text.length).toBeGreaterThan(20);
      for (const line of record.text) expect(line, sheet.slug).not.toMatch(/mvhs|\bowners?\b/i);
    }
    expect(sheetText.sheets.find((s) => s.slug === "hat-signals")!.text).toContain("HAT SIGNALS");
  });
});

/** Every frame's computed transform on the popup for its first 600 ms. */
async function popupTransformsOnOpen(page: Page): Promise<string[]> {
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
  return page.evaluate(() => (window as unknown as { __transforms: string[] }).__transforms);
}

test.describe("Schematics announcement, reduced motion", () => {
  // `reducedMotion` is a context option, not a top-level `use` one.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("fades in without scaling or sliding", async ({ page }) => {
    const transforms = await popupTransformsOnOpen(page);
    expect(transforms.length).toBeGreaterThan(5);
    expect(new Set(transforms)).toEqual(new Set(["none"]));
  });
});

test.describe("Schematics announcement on a portrait phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  const box = async (page: Page, selector: string) => (await activePanel(page).locator(selector).boundingBox())!;

  test("the stage hugs the sheet and the column fits the screen", async ({ page }) => {
    await markSeen(page);
    await page.goto("/#schematics");
    await expect(dialog(page)).toBeVisible({ timeout: 10_000 });
    // Measure once the sheet has finished rising into place.
    await settledDialog(page);
    const tabsTop: number[] = [];
    for (const i of [0, 3]) {
      if (i) await dialog(page).getByRole("tab", { name: SCHEMATIC_SHEETS[i].title, exact: true }).click();
      await expectSheet(page, i);
      const viewport = await box(page, "[data-zoomed]");
      const drawing = await box(page, '[role="img"]');
      // The sheet fills the width, and the air around it stays modest (it was ~350 px).
      expect(drawing.width).toBeGreaterThan(370);
      expect(viewport.height - drawing.height).toBeLessThan(150);
      expect(viewport.height).toBeLessThan(844 * 0.45);
      tabsTop.push((await dialog(page).getByRole("tablist").boundingBox())!.y);
    }
    // Flipping sheets doesn't move the tabs under a thumb.
    expect(tabsTop[1]).toBeCloseTo(tabsTop[0], 0);
    const github = (await dialog(page).getByRole("link", { name: /See it on GitHub/ }).boundingBox())!;
    expect(github.y + github.height).toBeLessThanOrEqual(844);
  });

  test("double-tap zooms in and the fit button brings it back", async ({ page }) => {
    await markSeen(page);
    await page.goto("/#schematics");
    await expect(dialog(page)).toBeVisible({ timeout: 10_000 });
    await expectSheet(page, 0);
    const viewport = activePanel(page).locator("[data-zoomed]");
    const b = (await viewport.boundingBox())!;
    const x = b.x + b.width / 2;
    const y = b.y + b.height / 2;
    await page.touchscreen.tap(x, y);
    await page.waitForTimeout(80);
    await page.touchscreen.tap(x, y);
    await expect(viewport).toHaveAttribute("data-zoomed", "true");
    await dialog(page).getByRole("button", { name: "Fit the sheet" }).click();
    await expect(viewport).toHaveAttribute("data-zoomed", "false");
  });

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("the sheet fades in without rising", async ({ page }) => {
      const transforms = await popupTransformsOnOpen(page);
      expect(transforms.length).toBeGreaterThan(5);
      expect(new Set(transforms)).toEqual(new Set(["none"]));
    });
  });
});
