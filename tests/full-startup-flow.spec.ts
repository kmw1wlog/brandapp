import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("full startup flow routes render in order", async ({ page }) => {
  const routes = [
    "/dashboard/startup/input",
    "/dashboard/startup/new",
    "/dashboard/startup/brand",
    "/dashboard/startup/finance",
    "/dashboard/startup/cost",
    "/dashboard/startup/suppliers",
    "/dashboard/startup/build",
    "/dashboard/startup/timetable",
    "/dashboard/startup/consultation",
    "/dashboard/startup/consultation/rfp",
    "/dashboard/startup/owner-conversion",
    "/dashboard/startup/owner-preview"
  ];

  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
    await expect(page.locator("[data-testid='branch-ready']")).toHaveCount(1);
    await expect(page.locator("body")).not.toContainText("NaN");
    await expect(page.locator("body")).not.toContainText("undefined");
    await expect(page.locator("body")).not.toContainText("Infinity");
  }
});
