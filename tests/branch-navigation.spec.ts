import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3003";

test("main branch flow routes are reachable", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/new`);
  await expect(page.getByRole("heading", { name: /프랜차이즈 상담 전에/ }).first()).toBeVisible();

  const routes = [
    "/dashboard/startup/brand",
    "/dashboard/startup/franchise",
    "/dashboard/startup/cost",
    "/dashboard/startup/suppliers",
    "/dashboard/startup/build",
    "/dashboard/startup/timetable",
    "/dashboard/startup/consultation",
    "/dashboard/startup/consultation/status",
    "/dashboard/startup/owner-preview"
  ];

  for (const route of routes) {
    await page.goto(`${baseURL}${route}`);
    await expect(page.locator("body")).not.toBeEmpty();
  }
});
