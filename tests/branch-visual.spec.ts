import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";
const routes = [
  ["new", "/dashboard/startup/new"],
  ["brand", "/dashboard/startup/brand"],
  ["franchise", "/dashboard/startup/franchise"],
  ["cost", "/dashboard/startup/cost"],
  ["suppliers", "/dashboard/startup/suppliers"],
  ["build", "/dashboard/startup/build"],
  ["timetable", "/dashboard/startup/timetable"],
  ["consultation", "/dashboard/startup/consultation"],
  ["consultation-status", "/dashboard/startup/consultation/status"],
  ["owner-preview", "/dashboard/startup/owner-preview"]
];

test("desktop pages render and capture visual baselines", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const [name, route] of routes) {
    await page.goto(`${baseURL}${route}`);
    await expect(page.locator("body")).not.toBeEmpty();
    await page.screenshot({ path: `test-results/branch-${name}.png`, fullPage: false });
  }
});

test("mobile layout has no horizontal overflow and template images load", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${baseURL}/dashboard/startup/brand`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  const loadedImages = await page.locator("img").evaluateAll((items) => items.filter((item) => (item as HTMLImageElement).naturalWidth > 0).length);
  expect(loadedImages).toBeGreaterThan(0);
});
