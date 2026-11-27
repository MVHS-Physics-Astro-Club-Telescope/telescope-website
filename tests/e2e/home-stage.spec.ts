import { test, expect } from "./fixtures";

/**
 * The home page's 3D telescope is a 3.6 MB model plus a Draco decoder and
 * decal images. If any of it fails to load, the story copy and the rest of
 * the page must stay up; only the 3D stage goes.
 */
test.describe("Home 3D stage", () => {
  test("loads the CAD model and its decoder", async ({ page }) => {
    const model = page.waitForResponse((r) => r.url().endsWith("/models/telescope.glb"));
    await page.goto("/");
    expect((await model).status()).toBe(200);
    await expect(page.locator('section[aria-label="The telescope"] canvas')).toBeVisible();
  });

  test("the page survives a model that fails to load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route("**/models/telescope.glb", (route) => route.fulfill({ status: 404, body: "" }));
    await page.goto("/");
    // the loader rejects shortly after the canvas mounts; give it time to throw
    await page.waitForTimeout(2500);
    await expect(page.getByRole("heading", { level: 1, name: "A telescope that aims itself." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "254 mm of glass at f/4.48." })).toBeAttached();
    await expect(page.getByRole("contentinfo")).toContainText(/independent student project/i);
    await expect(page.getByText(/Application error/i)).toHaveCount(0);
    // react-three-fiber hands errors its own root catches to window.reportError, so the failed load is
    // reported even though the boundary handled it; nothing else may be.
    expect(errors.filter((e) => !e.includes("Could not load /models/telescope.glb"))).toEqual([]);
  });
});
