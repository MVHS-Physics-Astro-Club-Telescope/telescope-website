import { test, expect } from "./fixtures";
import { getBuildCost, getStillToBuy } from "../../src/data/parts";
import { getTotalCashRaised } from "../../src/data/sponsors";

/**
 * The sponsor list and the money figures as reconciled on 2026-11-25 with the
 * finance lead: only sponsors who have actually given something are listed,
 * the $2,500 grant is named, and the budget is a real build cost rather than
 * a parts estimate that made the project look funded nine times over.
 */
const CLUB_EMAIL = "mvhsphysicsastroclub@gmail.com";

test.describe("Sponsors and budget", () => {
  test("sponsors page lists who actually gave, and names the grant", async ({ page }) => {
    await page.goto("/sponsors");
    const main = page.locator("main");
    await expect(main.getByText("MVLA High School Foundation", { exact: true })).toBeVisible();
    await expect(main.getByText("$2,500 Innovative Learning Grant", { exact: true })).toBeVisible();
    await expect(main.getByText("Anonymous", { exact: true })).toHaveCount(0);
    await expect(
      main.getByText("Scott Johnson · Mountain View Rotary Club", { exact: true }),
    ).toBeVisible();
    await expect(main.getByRole("link", { name: /^OSH Cut: / })).toBeVisible();
    // promised but nothing received yet
    await expect(main.getByRole("link", { name: /^PCBWay: / })).toHaveCount(0);
    await expect(main.getByRole("link", { name: /^Copy Factory: / })).toHaveCount(0);
  });

  test("cash raised matches the reconciled ledger", async () => {
    // MVLA High School Foundation 2,500 + Tri-Valley Stargazers 500 + Crave Yoga 250
    // + Scott Johnson 250 + Tori Atwell 100, each confirmed on the receiving side.
    expect(getTotalCashRaised()).toBe(3600);
  });

  test("home support tiles show a build cost, not a parts budget", async ({ page }) => {
    await page.goto("/#support");
    const support = page.locator("#support");
    await expect(support).not.toContainText(/Parts budget/i);
    await expect(support).toContainText("Build cost");
    await expect(support).toContainText(`$${getBuildCost().toLocaleString()}`);
    await expect(support).toContainText(`$${getTotalCashRaised().toLocaleString()}`);
  });

  test("parts page shows the same build cost and what is still to buy", async ({ page }) => {
    await page.goto("/parts");
    const main = page.locator("main");
    await expect(main).toContainText(`$${getBuildCost().toLocaleString()}`);
    await expect(main).toContainText(`$${Math.round(getStillToBuy()).toLocaleString()}`);
    await expect(main.getByText("Rocker Box + Mirror Box", { exact: true })).toBeVisible();
  });

  for (const path of ["/", "/sponsors", "/parts", "/observe", "/request"]) {
    test(`contact links on ${path} use the club address`, async ({ page }) => {
      await page.goto(path);
      const html = await page.content();
      expect(html).not.toContain("contact@mvhsastro.org");
      await expect(page.getByRole("contentinfo").getByRole("link", { name: CLUB_EMAIL })).toHaveAttribute(
        "href",
        `mailto:${CLUB_EMAIL}`,
      );
    });
  }
});
