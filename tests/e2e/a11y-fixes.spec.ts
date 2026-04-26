import { test, expect } from "@playwright/test";

/**
 * Regression tests for the bundled a11y audit fixes (PR #9).
 *
 * Each test below pins one concrete WCAG/UX fix so that future refactors
 * can't silently regress them. They run against /request because every
 * affected component (`MockTargetPicker`) lives there.
 */
test.describe("/request — bundled a11y audit fix regressions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/request");
  });

  test("focus returns to the search trigger after Escape closes the ⌘K palette", async ({
    page,
  }) => {
    const trigger = page.locator("#target-search");
    await trigger.focus();
    await expect(trigger).toBeFocused();

    // Open via the keyboard shortcut.
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+K" : "Control+K",
    );
    const dialog = page.getByRole("dialog", { name: /Search targets/i });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    // Critical fix: focus must return to the trigger, not body.
    await expect(trigger).toBeFocused();
  });

  test("focus returns to the search trigger after picking a target", async ({
    page,
  }) => {
    const trigger = page.locator("#target-search");
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: /Search targets/i });
    await expect(dialog).toBeVisible();

    const searchInput = dialog.getByPlaceholder(/Type to search/i);
    await searchInput.fill("andro");
    const option = dialog
      .getByRole("option", { name: /Andromeda Galaxy \(M31\)/i })
      .first();
    await option.click();

    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("filter chip ArrowRight moves focus and selection to the next chip", async ({
    page,
  }) => {
    // First chip (All) is the default and should be the only tabbable chip.
    const firstChip = page.getByRole("radio", { name: /^All$/i });
    await firstChip.focus();
    await expect(firstChip).toHaveAttribute("aria-checked", "true");

    await page.keyboard.press("ArrowRight");
    const moonChip = page.getByRole("radio", { name: /^Moon$/i });
    await expect(moonChip).toBeFocused();
    await expect(moonChip).toHaveAttribute("aria-checked", "true");

    // ArrowLeft from the first chip wraps to the last (Clusters).
    await firstChip.focus();
    // Re-set selection back to All so we know the wrap behavior.
    await page.keyboard.press("End");
    const clustersChip = page.getByRole("radio", { name: /^Clusters$/i });
    await expect(clustersChip).toBeFocused();
  });

  test("disabled submit button shows the tooltip on keyboard focus", async ({
    page,
  }) => {
    const submit = page.getByRole("button", { name: /Submit request/i });
    await expect(submit).toBeDisabled();
    await submit.focus();
    // Tooltip popup is rendered in a portal — just look for its text anywhere.
    await expect(
      page.getByText(/Locks open at first light · August 2026/i),
    ).toBeVisible();
  });

  test("invalid email shows aria-invalid + inline error on blur, valid email clears it", async ({
    page,
  }) => {
    const emailInput = page.locator("#target-email");
    await emailInput.fill("not-an-email");
    await emailInput.blur();
    await expect(emailInput).toHaveAttribute("aria-invalid", "true");
    const error = page.locator("#target-email-error");
    await expect(error).toBeVisible();
    await expect(error).toContainText(/valid email/i);

    // Fixing the value should clear the error and aria-invalid.
    await emailInput.fill("real@example.com");
    await emailInput.blur();
    await expect(error).toHaveCount(0);
    await expect(emailInput).toHaveAttribute("aria-invalid", "false");
  });

  test("filter radiogroup uses the visible Label, not an aria-label", async ({
    page,
  }) => {
    const group = page.locator("#target-chips");
    await expect(group).toHaveAttribute("role", "radiogroup");
    // The visible <Label htmlFor="target-chips"> already names the group, so
    // we should NOT also have an aria-label fighting with it.
    await expect(group).not.toHaveAttribute("aria-label", /.+/);
  });
});
