import { test, expect } from "@playwright/test";

/**
 * Locks in the public statements the site must always carry: the
 * independence disclaimer (site-wide footer) and the roles note under the
 * crew grid.
 */
test.describe("Public disclaimers", () => {
  const pages = ["/", "/observe", "/request", "/sponsors", "/parts"];

  for (const path of pages) {
    test(`independence disclaimer is in the footer on ${path}`, async ({ page }) => {
      await page.goto(path);
      const footer = page.getByRole("contentinfo");
      await expect(footer).toContainText(/MV Astronomy is an independent student project/i);
      await expect(footer).toContainText(
        /not affiliated with, endorsed by, or sponsored by Mountain View High School or the Mountain View–Los Altos Union High School District/i,
      );
    });

    test(`no "MVHS" branding in visible copy on ${path}`, async ({ page }) => {
      await page.goto(path);
      const body = (await page.locator("body").innerText()).replace(
        // live external identifiers that cannot be renamed from this repo
        /@?mvhs_physics_astro_club|MVHSTELE500/g,
        "",
      );
      expect(body).not.toMatch(/MVHS/);
    });
  }

  test("crew section states the roles and that there is no president", async ({ page }) => {
    await page.goto("/#crew");
    const note = page.getByText(/This project has no president/i);
    await expect(note).toBeVisible();
    await expect(note).toContainText(/Vidu Senadheera and David Cho \(Mechanical\)/);
    await expect(note).toContainText(/Eeshan Khandelwal \(Electronics & Software\)/);
    // Eeshan is the sole Electronics & Software lead; Neel is an electronics member.
    await expect(note).not.toContainText(/Neel Chhatrala \(Electronics\)/);
    await expect(note).toContainText(/Neel Chhatrala and Ibrahim Hasan are electronics members/);
    await expect(note).toContainText(/Aryan Khanna \(Physics Calculations\)/);
    await expect(note).toContainText(/Tristan Schaefer \(Outreach\)/);
    await expect(note).toContainText(/Ishaan Sakariya and Dominic Reouk are mechanical members/);
    await expect(note).toContainText(/Sophie Weng is an outreach member/);
  });

  test("crew grid lists all ten members with their roles", async ({ page }) => {
    await page.goto("/#crew");
    const crew = page.locator("#crew");
    const roster: [string, string][] = [
      ["Vidu Senadheera", "Co-Mechanical Lead"],
      ["David Cho", "Co-Mechanical Lead"],
      ["Eeshan Khandelwal", "Electronics & Software Lead"],
      ["Neel Chhatrala", "Electronics"],
      ["Ibrahim Hasan", "Electronics"],
      ["Sophie Weng", "Outreach"],
      ["Aryan Khanna", "Physics Calculation Lead"],
      ["Tristan Schaefer", "Outreach Lead"],
      ["Ishaan Sakariya", "Mechanical"],
      ["Dominic Reouk", "Mechanical"],
    ];
    for (const [name, role] of roster) {
      const card = crew.locator("li", { hasText: name });
      await expect(card.getByText(name, { exact: true })).toBeVisible();
      await expect(card.getByText(role, { exact: true })).toBeVisible();
    }
    for (const name of ["Dominic Reouk", "Ibrahim Hasan", "Sophie Weng"]) {
      const img = crew.locator(`img[alt='${name}']`);
      await img.scrollIntoViewIfNeeded();
      await expect(img).toBeVisible();
      // the photo actually loaded, not a broken image
      expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await expect(crew.locator("li")).toHaveCount(10);
    // every count of the crew on the site matches the grid
    await expect(crew.getByRole("heading", { level: 2 })).toHaveText(/^Ten students\./);
    await expect(crew.getByText("Electronics Lead", { exact: true })).toHaveCount(0);
  });

  test("home story and site description count the same crew as the grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/designed and built from scratch by ten\s+students/i)).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /built by ten high-school students/,
    );
  });

  test("sponsor perks do not claim tax-deductibility", async ({ page }) => {
    await page.goto("/#support");
    const support = await page.locator("#support").innerText();
    expect(support).not.toMatch(/tax-deductible/i);
    expect(support).not.toMatch(/school district/i);
    await expect(page.locator("#support")).toContainText(/A permanent listing on our sponsors page/i);
  });
});
