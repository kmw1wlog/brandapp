import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("supplier page shows verified product and missing price states", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/suppliers`, { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "식재료" })).toBeVisible();
  await expect(page.getByText("다봄푸드 냉동 우삼겹 1kg")).toBeVisible();
  await expect(page.getByText("업소용 CJ프레시웨이 농협 온미쌀 20kg")).toBeVisible();

  await page.getByRole("button", { name: "주방설비" }).click();
  await expect(page.getByText("그랜드우성 업소용 냉장고 GWS-632RF 2도어")).toBeVisible();
  await expect(page.getByRole("cell", { name: "견적 필요", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "간판/인쇄" }).click();
  await expect(page.getByText("레드프린팅 앤 프레스")).toBeVisible();

  await page.getByRole("button", { name: "데이터 품질" }).click();
  await expect(page.getByText("청정원 햇살담은 조림간장 1.7L+500ml")).toBeVisible();
  await expect(page.getByRole("cell", { name: "0원", exact: true })).toHaveCount(0);
});
