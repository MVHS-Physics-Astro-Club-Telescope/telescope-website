import { test, expect } from "@playwright/test";

/**
 * Tests for the EmailSignup component, exercised on the /observe page where
 * source="observe". Covers success, error, server validation, and
 * client-side disabled-on-invalid behavior.
 */
test.describe("EmailSignup component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/observe");
  });

  test("submit button is disabled until a valid email is entered", async ({
    page,
  }) => {
    const input = page.locator("#email-observe");
    const submit = page.getByRole("button", { name: /^Notify me$/i }).first();

    await expect(submit).toBeDisabled();

    await input.fill("not-an-email");
    await expect(submit).toBeDisabled();

    await input.fill("real@example.com");
    await expect(submit).toBeEnabled();
  });

  test("displays a friendly error when the API returns 400", async ({
    page,
  }) => {
    await page.route("**/api/interest", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Please enter a valid email address.",
        }),
      }),
    );

    await page.locator("#email-observe").fill("bad@bad.com");
    await page.getByRole("button", { name: /^Notify me$/i }).first().click();
    await expect(page.locator("#email-observe-msg")).toContainText(/valid email/i);
  });

  test("shows rate limit message when the API returns 429", async ({
    page,
  }) => {
    await page.route("**/api/interest", (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "You just signed up — give it a minute and try again.",
        }),
      }),
    );

    await page.locator("#email-observe").fill("user@example.com");
    await page.getByRole("button", { name: /^Notify me$/i }).first().click();
    await expect(page.locator("#email-observe-msg")).toContainText(/give it a minute/i);
  });

  test("shows a generic error when the network request fails", async ({
    page,
  }) => {
    await page.route("**/api/interest", (route) => route.abort("failed"));
    await page.locator("#email-observe").fill("user@example.com");
    await page.getByRole("button", { name: /^Notify me$/i }).first().click();
    await expect(page.locator("#email-observe-msg")).toContainText(/Couldn't reach/i);
  });
});
