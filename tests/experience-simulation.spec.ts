import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("industry input drives virtual brand, benchmark, menu, and KIE templates", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/input`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "커피/버블티/음료" }).click();
  await page.getByRole("button", { name: "저장 후 비교 화면으로 이동" }).click();

  await expect(page).toHaveURL(/\/dashboard\/startup\/new/);
  await expect(page.getByTestId("experience-simulation")).toBeVisible();
  await expect(page.getByText("커피/버블티/음료 데이터로 공정위 업종 평균과 입지 보정값을 연결했습니다.")).toBeVisible();
  await expect(page.getByText("브루리프")).toBeVisible();
  await expect(page.getByText(/표본 \d+개 브랜드/)).toBeVisible();
  await expect(page.getByText("아메리카노")).toBeVisible();
  await expect(page.getByText("KIE nano banana template").first()).toBeVisible();

  await page.getByRole("button").filter({ hasText: "KIE nano banana template" }).first().click();
  await expect(page.getByText("KIE API 키 없음: 템플릿 이미지로 mock 생성 흐름 확인")).toBeVisible();
});
