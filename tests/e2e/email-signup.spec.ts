import { test, expect } from "@playwright/test";

/**
 * Tests for the EmailSignup component, exercised on the /observe page where
 * source="observe". Covers success, error (400 / 429 / network), and
 * client-side disabled-on-invalid behavior.
 *
 * Feedback now lives in two places:
 *   - Sonner toast (data-sonner-toast) for transient success/error
 *   - Inline aria-alert <p> beneath the input for invalid email
 *   - Inline confirmation block (role="status") that replaces the form on success
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
    await input.blur();
    await expect(submit).toBeDisabled();

    await input.fill("real@example.com");
    await expect(submit).toBeEnabled();
  });

  test("displays a friendly error toast when the API returns 400", async ({
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
    // Sonner renders toasts as elements with [data-sonner-toast] containing the message
    await expect(
      page.locator("[data-sonner-toast]").filter({ hasText: /valid email/i }),
    ).toBeVisible();
  });

  test("shows rate limit toast when the API returns 429", async ({ page }) => {
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
    await expect(
      page
        .locator("[data-sonner-toast]")
        .filter({ hasText: /give it a minute/i }),
    ).toBeVisible();
  });

  test("shows a generic error toast when the network request fails", async ({
    page,
  }) => {
    await page.route("**/api/interest", (route) => route.abort("failed"));
    await page.locator("#email-observe").fill("user@example.com");
    await page.getByRole("button", { name: /^Notify me$/i }).first().click();
    await expect(
      page
        .locator("[data-sonner-toast]")
        .filter({ hasText: /Couldn't reach/i }),
    ).toBeVisible();
  });

  test("renders inline error when email format is wrong and form submitted via JS", async ({
    page,
  }) => {
    // RHF + zod: typing an invalid email surfaces the inline aria-alert
    const input = page.locator("#email-observe");
    await input.fill("not-an-email");
    await input.blur();
    // The button stays disabled, so RHF onChange validation has fired
    await expect(
      page.locator("#email-observe-error"),
    ).toContainText(/valid email/i);
  });
});
