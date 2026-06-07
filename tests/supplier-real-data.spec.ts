import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3003";

test("supplier page shows verified product and missing price states", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/suppliers`, { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "검증 상품" })).toBeVisible();
  await expect(page.getByText("다봄푸드 냉동 우삼겹 1kg")).toBeVisible();
  await expect(page.getByText("업소용 CJ프레시웨이 농협 온미쌀 20kg")).toBeVisible();

  await page.getByRole("button", { name: "추가 확인 후보" }).click();
  await expect(page.getByText("청정원 햇살담은 조림간장 1.7L+500ml")).toBeVisible();

  await page.getByRole("button", { name: "가격 확인 필요" }).click();
  await expect(page.getByText("가격 확인 필요").first()).toBeVisible();
  await expect(page.getByText("0원")).toHaveCount(0);
});
