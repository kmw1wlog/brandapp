import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("startup input saves required values and summary appears on comparison page", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/input`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "5,000만원" }).click();
  await page.getByRole("button", { name: "부산 대학가" }).click();
  await page.getByRole("button", { name: "45일 뒤" }).click();
  await page.getByRole("button", { name: "저장 후 비교 화면으로 이동" }).click();

  await expect(page).toHaveURL(/\/dashboard\/startup\/new/);
  await expect(page.getByText("예산 5,000만원").first()).toBeVisible();
  await expect(page.getByText("지역 부산 대학가").first()).toBeVisible();

  const stored = await page.evaluate(() => JSON.parse(window.localStorage.getItem("branch_user_input_v1") ?? "{}"));
  expect(stored.budget).toBe(50_000_000);
  expect(stored.region).toBe("부산 대학가");
  expect(stored.opening_target.days).toBe(45);
});
