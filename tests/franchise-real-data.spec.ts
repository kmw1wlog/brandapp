import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("franchise page prioritizes industry average and keeps brand examples as support", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/franchise`);
  await expect(page.getByText("업종 평균 우선", { exact: true })).toBeVisible();
  await expect(page.getByText("내 브랜드안", { exact: true })).toBeVisible();
  await expect(page.getByText("예시 브랜드 4개 보기", { exact: true })).toBeVisible();
  await page.getByText("예시 브랜드 4개 보기", { exact: true }).click();
  await expect(page.locator("[data-testid='resolved-brand-examples']")).toContainText("한솥");
  await expect(page.getByText("수익 보장")).toHaveCount(0);
});
