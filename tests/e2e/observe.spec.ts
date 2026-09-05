import { test, expect } from "@playwright/test";

test.describe("/observe — live view preview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/observe");
  });

  test("loads with the right title and heading", async ({ page }) => {
    await expect(page).toHaveTitle(/Live View — MV Astronomy/);
    await expect(page.getByRole("heading", { level: 1, name: /Watch it work/i })).toBeVisible();
  });

  test("states plainly that the live view is not online yet", async ({ page }) => {
    const status = page.getByRole("status").first();
    await expect(status).toBeVisible();
    await expect(status).toContainText(/Coming soon/i);
    await expect(status).toContainText(/first light/i);
  });

  test("shows tonight's sky conditions", async ({ page }) => {
    const widget = page.getByRole("region", { name: /Tonight's sky conditions at MV/i });
    await expect(widget).toBeVisible();
    await expect(widget).toContainText(/Cloud cover/i);
    await expect(widget).toContainText(/Seeing/i);
    await expect(widget).toContainText(/Sunset/i);
  });

  test("email signup posts to /api/interest and shows success", async ({ page }) => {
    await page.route("**/api/interest", async (route) => {
      const body = route.request().postDataJSON() as { email: string; source: string };
      expect(body.source).toBe("observe");
      expect(body.email).toMatch(/@/);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "You're on the list. Test mock." }),
      });
    });
    await page.locator("#email-observe").fill("test-observe@example.com");
    await page.getByRole("button", { name: /^Notify me$/i }).first().click();
    await expect(
      page
        .locator("[data-sonner-toast], #email-observe-msg")
        .filter({ hasText: /(test mock|on the list)/i })
        .first(),
    ).toBeVisible();
  });

  test("homepage links to /observe from the story outro", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /Watch it work/i });
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/observe$/);
  });
});
