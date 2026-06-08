import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";
test.setTimeout(180000);

test("brand page generates a real KIE image and applies it", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/brand`, { waitUntil: "networkidle" });
  await expect(page.locator("img").first()).toBeVisible();
  await page.getByRole("button", { name: "AI로 외관 다시 생성" }).click();
  await expect(page.getByRole("dialog", { name: "KIE 이미지 생성" })).toBeVisible();
  await page.getByRole("button", { name: "실제 KIE 생성 실행" }).click();
  await expect(page.getByText(/KIE 생성이 완료되어 새 시안을 반영했습니다.|이전에 성공한 KIE 생성 결과를 다시 반영했습니다./)).toBeVisible({ timeout: 120000 });
  await expect(page.getByText("KIE 생성 완료").first()).toBeVisible();
});
