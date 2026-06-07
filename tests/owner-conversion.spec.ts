import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("owner conversion stores owner_demo and owner preview shows free banner", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/owner-conversion`, { waitUntil: "networkidle" });
  await expect(page.getByText("점주 전환 시 제공 기능")).toBeVisible();
  await page.getByRole("button", { name: "점주 계정으로 전환 데모" }).click();

  await expect(page).toHaveURL(/\/dashboard\/startup\/owner-preview/);
  await expect(page.getByRole("heading", { name: "브랜치로 개점하면 운영 대시보드 3개월 무료" })).toBeVisible();
  await expect(page.getByText("계획 매출 vs 샘플 실제 매출")).toBeVisible();

  const state = await page.evaluate(() => JSON.parse(window.localStorage.getItem("branch_owner_conversion_v1") ?? "{}"));
  expect(state.accountStage).toBe("owner_demo");
});
