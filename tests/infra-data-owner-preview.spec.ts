import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("owner preview shows infra operating references", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/owner-preview`, { waitUntil: "networkidle" });

  await expect(page.getByText("2026 최저임금 10,320원/h")).toBeVisible();
  await expect(page.getByText("월 209시간 기준 2,156,880원")).toBeVisible();
  await expect(page.getByText("토스플레이스")).toBeVisible();
  await expect(page.getByText("바로고")).toBeVisible();
});
