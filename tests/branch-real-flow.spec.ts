import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("main page uses real franchise cohort copy", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/new`);
  await expect(page.getByText("고기덮밥 프랜차이즈 직접 비교군")).toBeVisible();
  await expect(page.getByText("7개 브랜드 공개정보 기반")).toBeVisible();
  await expect(page.getByText("동종 외식 프랜차이즈 비교 평균")).toHaveCount(0);
  await page.getByRole("link", { name: "프랜차이즈 자세히 보기" }).click();
  await expect(page).toHaveURL(/\/dashboard\/startup\/franchise/);
});
