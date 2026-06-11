import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("location profile page renders SBIZ data and 365 modules", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/location`);

  await expect(page.getByRole("heading", { name: "입지 분석" })).toBeVisible();
  await expect(page.getByText("전국 상가 업소")).toBeVisible();
  await expect(page.getByText("2,725,319")).toBeVisible();
  await expect(page.getByText("827,828")).toBeVisible();
  await expect(page.getByText("부산대 상권 일식 카레/돈가스/덮밥 800m")).toBeVisible();
  await expect(page.getByText("cacheKey: 35.23125,129.08412:800:I20302:2026-06-08")).toBeVisible();
  await expect(page.getByText("소상공인365 분석 모듈 11개")).toBeVisible();
  await expect(page.locator("a[aria-label$='공식 화면 열기']")).toHaveCount(11);
  await expect(page.getByText("상가 상권정보 REST API 19개")).toBeVisible();
  await expect(page.getByText("반경내 상가업소 조회")).toBeVisible();
  await expect(page.getByText("일식 카레/돈가스/덮밥", { exact: true })).toBeVisible();
});
