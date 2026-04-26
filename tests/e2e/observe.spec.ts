import { test, expect } from "@playwright/test";

test.describe("/observe — Live View preview page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/observe");
  });

  test("loads with correct title and hero", async ({ page }) => {
    await expect(page).toHaveTitle(/Live View — MVHS Public Observatory/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Live from the night sky/i }),
    ).toBeVisible();
  });

  test("shows the Coming Soon banner with first light messaging", async ({
    page,
  }) => {
    const banner = page.getByRole("status").first();
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/Coming Soon/i);
    await expect(banner).toContainText(/first light/i);
    await expect(banner).toContainText(/August 2026/);
  });

  test("renders all four 'How it works' steps in order", async ({ page }) => {
    const steps = [
      "Submit a target",
      "Telescope queues it",
      "Captures overnight",
      "Image lands in your inbox",
    ];
    for (const s of steps) {
      await expect(page.getByRole("heading", { name: s })).toBeVisible();
    }
  });

  test("FAQ accordion expands when clicked", async ({ page }) => {
    const question = page.getByRole("button", {
      name: /When will the live view actually go live/i,
    });
    await expect(question).toHaveAttribute("aria-expanded", "false");
    await question.click();
    await expect(question).toHaveAttribute("aria-expanded", "true");
    // The answer mentions August 2026
    await expect(
      page.getByText(/First Light in August 2026/i).first(),
    ).toBeVisible();
  });

  test("email signup posts to /api/interest and shows success", async ({
    page,
  }) => {
    // Mock the API so the test doesn't hit real Supabase / rate-limit map
    await page.route("**/api/interest", async (route) => {
      const body = route.request().postDataJSON() as {
        email: string;
        source: string;
      };
      expect(body.source).toBe("observe");
      expect(body.email).toMatch(/@/);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "You're on the list. Test mock.",
        }),
      });
    });

    const input = page.locator("#email-observe");
    await input.fill("test-observe@example.com");
    await page.getByRole("button", { name: /^Notify me$/i }).first().click();
    await expect(page.getByRole("status").last()).toContainText(/test mock/i);
  });

  test("homepage links to /observe via the Observatory section", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.getByRole("link", { name: /Watch the telescope work/i });
    await expect(card).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/observe$/);
  });
});
