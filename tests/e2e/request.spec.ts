import { test, expect } from "@playwright/test";
import { gotoHydrated } from "./helpers";

test.describe("/request — target request preview", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, "/request", "#target-search");
  });

  test("loads with the right title and heading", async ({ page }) => {
    await expect(page).toHaveTitle(/Request a target — MV Astronomy/);
    await expect(page.getByRole("heading", { level: 1, name: /Tell it what to capture/i })).toBeVisible();
  });

  test("states plainly that the queue is not open yet", async ({ page }) => {
    const status = page.getByRole("status").first();
    await expect(status).toBeVisible();
    await expect(status).toContainText(/Coming soon/i);
    await expect(status).toContainText(/request queue/i);
  });

  test("submit button is locked with an explanatory tooltip", async ({ page }) => {
    const submit = page.getByRole("button", { name: /Submit request/i });
    await expect(submit).toHaveAttribute("aria-disabled", "true");
    await expect(submit).toHaveAttribute("title", /Submissions open when telescope goes online/i);
  });

  test("filter chips render and respond to clicks", async ({ page }) => {
    const galaxiesChip = page.getByRole("radio", { name: /^Galaxies$/i });
    await expect(galaxiesChip).toBeVisible();
    await galaxiesChip.click();
    await expect(galaxiesChip).toHaveAttribute("aria-checked", "true");
  });

  test("⌘K opens the target palette", async ({ page }) => {
    await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
    const dialog = page.getByRole("dialog", { name: /Search targets/i });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("picking a target from the palette fills the preview", async ({ page }) => {
    await page.locator("#target-search").click();
    const dialog = page.getByRole("dialog", { name: /Search targets/i });
    await expect(dialog).toBeVisible();
    await dialog.getByPlaceholder(/Type to search/i).fill("andro");
    const option = dialog.getByRole("option", { name: /Andromeda Galaxy \(M31\)/i }).first();
    await expect(option).toBeVisible();
    await option.click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole("heading", { name: /Andromeda Galaxy \(M31\)/i })).toBeVisible();
    await expect(page.getByText(/^Easy · Galaxy$/i)).toBeVisible();
    await expect(page.locator("#target-search")).toContainText(/Andromeda/i);
  });

  test("email signup posts to /api/interest with source=request", async ({ page }) => {
    await page.route("**/api/interest", async (route) => {
      const body = route.request().postDataJSON() as { email: string; source: string };
      expect(body.source).toBe("request");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "You're on the list. Test mock." }),
      });
    });
    await page.locator("#email-request").fill("test-request@example.com");
    await page.getByRole("button", { name: /^Notify me$/i }).first().click();
    await expect(
      page
        .locator("[data-sonner-toast], #email-request-msg")
        .filter({ hasText: /(test mock|on the list)/i })
        .first(),
    ).toBeVisible();
  });

  test("homepage links to /request from the story outro", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /Request a target/i });
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/request$/);
  });
});
