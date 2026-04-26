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
    await expect(banner).toContainText(/(Submissions open|Request queue|First Light)/i);
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

  test("filter chips render and respond to clicks", async ({ page }) => {
    const galaxiesChip = page.getByRole("radio", { name: /^Galaxies$/i });
    await expect(galaxiesChip).toBeVisible();
    await galaxiesChip.click();
    await expect(galaxiesChip).toHaveAttribute("aria-checked", "true");
  });

  test("⌘K keyboard shortcut opens the target command palette", async ({
    page,
  }) => {
    // Open via keyboard
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+K" : "Control+K",
    );
    const dialog = page.getByRole("dialog", { name: /Search targets/i });
    await expect(dialog).toBeVisible();
    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("clicking the search trigger opens the palette and selecting a target populates the preview", async ({
    page,
  }) => {
    await page.locator("#target-search").click();
    const dialog = page.getByRole("dialog", { name: /Search targets/i });
    await expect(dialog).toBeVisible();

    // Type to filter
    const searchInput = dialog.getByPlaceholder(/Type to search/i);
    await searchInput.fill("andro");

    // The Andromeda option should appear; click it.
    const option = dialog
      .getByRole("option", { name: /Andromeda Galaxy \(M31\)/i })
      .first();
    await expect(option).toBeVisible();
    await option.click();

    // Dialog closes, preview card appears with badges
    await expect(dialog).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Andromeda Galaxy \(M31\)/i }),
    ).toBeVisible();
    // Tier or type badge visible
    await expect(page.getByText(/^Easy$/i).first()).toBeVisible();
    // Selected name is reflected in the trigger button
    await expect(page.locator("#target-search")).toContainText(/Andromeda/i);
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
    await expect(
      page
        .locator("[data-sonner-toast], #email-request-msg")
        .filter({ hasText: /(test mock|on the list)/i })
        .first(),
    ).toBeVisible();
  });

  test("navigation from homepage works", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("link", { name: /Tell it what to capture/i });
    await expect(card).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/request$/);
  });
});
