import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("timetable page shows official infra links on tasks", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/timetable`, { waitUntil: "networkidle" });

  await expect(page.getByRole("link", { name: /공식 링크: 한국외식업중앙회/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /공식 링크: e보건소/ })).toBeVisible();

  const hygieneLink = page.getByRole("link", { name: /공식 링크: 한국외식업중앙회/ }).first();
  await expect(hygieneLink).toHaveAttribute("target", "_blank");
});
