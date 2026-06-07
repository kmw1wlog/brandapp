import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("brand page keeps template image and shows mock generation flow without API key", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/brand`, { waitUntil: "networkidle" });
  await expect(page.locator("img").first()).toBeVisible();
  await page.getByRole("button", { name: "AI로 외관 다시 생성" }).click();
  await expect(page.getByRole("dialog", { name: "이미지 생성 API 연결 전 샘플" })).toBeVisible();
  await page.getByRole("button", { name: "샘플 시안 확인" }).click();
  await expect(page.getByText("샘플 생성 흐름만 표시합니다. 기존 템플릿 이미지를 유지합니다.")).toBeVisible();
});
