import { test, expect } from "@playwright/test";

test.describe("/request — Submit Target preview page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/request");
  });

  test("loads with correct title and hero", async ({ page }) => {
    await expect(page).toHaveTitle(
      /Request a target — MVHS Public Observatory/,
    );
    await expect(
      page.getByRole("heading", { level: 1, name: /Request a target/i }),
    ).toBeVisible();
  });

  test("shows the Coming Soon banner", async ({ page }) => {
    const banner = page.getByRole("status").first();
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/Submissions open/i);
  });

  test("submit button is disabled with explanatory tooltip", async ({
    page,
  }) => {
    const submit = page.getByRole("button", { name: /Submit request/i });
    await expect(submit).toBeDisabled();
    await expect(submit).toHaveAttribute(
      "title",
      /Submissions open when telescope goes online/i,
    );
  });

  test("typeahead surfaces matches and selecting fills the input", async ({
    page,
  }) => {
    const input = page.locator("#target-search");
    await input.fill("andro");
    // Listbox appears
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    const option = page.getByRole("option", {
      name: /Andromeda Galaxy \(M31\)/i,
    });
    await expect(option).toBeVisible();
    await option.click();
    await expect(input).toHaveValue(/Andromeda/);
    // Preview card should now show
    await expect(
      page.getByRole("heading", { name: /Andromeda Galaxy \(M31\)/i }),
    ).toBeVisible();
  });

  test("renders all three 'What we can capture' categories", async ({
    page,
  }) => {
    for (const cat of ["Moon & planets", "Bright nebulae & clusters", "Galaxies"]) {
      await expect(page.getByRole("heading", { name: cat })).toBeVisible();
    }
  });

  test("email signup posts to /api/interest with source=request", async ({
    page,
  }) => {
    await page.route("**/api/interest", async (route) => {
      const body = route.request().postDataJSON() as {
        email: string;
        source: string;
      };
      expect(body.source).toBe("request");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "You're on the list. Test mock.",
        }),
      });
    });

    await page.locator("#email-request").fill("test-request@example.com");
    await page.getByRole("button", { name: /^Notify me$/i }).first().click();
    await expect(page.getByRole("status").last()).toContainText(/test mock/i);
  });

  test("navigation from homepage works", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("link", { name: /Tell it what to capture/i });
    await expect(card).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/request$/);
  });
});
