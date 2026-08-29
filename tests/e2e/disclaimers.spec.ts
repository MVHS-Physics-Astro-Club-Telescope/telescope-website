import { test, expect } from "@playwright/test";

/**
 * Locks in the two public statements the site must always carry:
 * the independence disclaimer (site-wide footer) and the leadership note
 * under the crew grid.
 */
test.describe("Public disclaimers", () => {
  const pages = ["/", "/observe", "/request", "/sponsors", "/parts"];

  for (const path of pages) {
    test(`independence disclaimer is in the footer on ${path}`, async ({
      page,
    }) => {
      await page.goto(path);
      const footer = page.getByRole("contentinfo");
      await expect(footer).toContainText(
        /MV Astronomy is an independent student project/i,
      );
      await expect(footer).toContainText(
        /not affiliated with, endorsed by, or sponsored by Mountain View High School or the Mountain View–Los Altos Union High School District/i,
      );
    });

    test(`no "MVHS" branding in visible copy on ${path}`, async ({ page }) => {
      await page.goto(path);
      const body = (await page.locator("body").innerText()).replace(
        // live external identifiers that cannot be renamed from this repo
        /mvhsphysicsastroclub@gmail\.com|@?mvhs_physics_astro_club|MVHSTELE500/g,
        "",
      );
      expect(body).not.toMatch(/MVHS/);
    });
  }

  test("crew section states leadership and that Aryan Khanna is not a lead", async ({
    page,
  }) => {
    await page.goto("/#team");
    const note = page.getByText(/This project has no president/i);
    await expect(note).toBeVisible();
    await expect(note).toContainText(
      /Aryan Khanna is a general member and does not hold a president or project-lead role on this project/i,
    );
  });

  test("sponsor perks no longer claim tax-deductibility via the district", async ({
    page,
  }) => {
    await page.goto("/#support");
    const support = await page.locator("#support").innerText();
    expect(support).not.toMatch(/tax-deductible/i);
    // the only permitted "School District" on the site is the footer disclaimer
    expect(support).not.toMatch(/school district/i);
    await expect(page.locator("#support")).toContainText(
      /A permanent listing on our sponsors page/i,
    );
  });
});
