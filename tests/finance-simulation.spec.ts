import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("finance simulation shows scenarios, ledger, cash, and links to cost", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/brand`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "이 브랜드로 4개월 회계 시뮬레이션 보기" }).click();

  await expect(page).toHaveURL(/\/dashboard\/startup\/finance/);
  await expect(page.getByRole("heading", { name: "4개월 회계 시뮬레이터" })).toBeVisible();
  await expect(page.getByText("0개월차: 개점 전 지출")).toBeVisible();
  await expect(page.getByText("월별 현금잔고 그래프")).toBeVisible();
  await expect(page.getByText("민감도 카드")).toBeVisible();

  await page.getByRole("button", { name: "보수적" }).click();
  await page.getByRole("button", { name: "낙관적" }).click();
  await expect(page.getByText(/NaN|undefined|Infinity/)).toHaveCount(0);

  await page.getByRole("link", { name: "메뉴와 원가를 더 정확히 구성하기" }).click();
  await expect(page).toHaveURL(/\/dashboard\/startup\/cost/);
  await expect(page.getByText("4개월 회계 시뮬레이션의 기준값")).toBeVisible();
});
