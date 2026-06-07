import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("dynamic timetable regenerates by opening target and keeps completed task state", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/input`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "45일 뒤" }).click();
  await page.getByRole("button", { name: "저장 후 비교 화면으로 이동" }).click();
  await page.goto(`${baseURL}/dashboard/startup/timetable`, { waitUntil: "networkidle" });

  await expect(page.getByText("준비기간 45일 · 기본형")).toBeVisible();
  await expect(page.getByText("D-45").first()).toBeVisible();
  await page.getByRole("button", { name: "완료" }).first().click();
  await expect(page.getByText("완료").first()).toBeVisible();

  await page.getByRole("button", { name: "2주 뒤" }).click();
  await expect(page.getByText("준비기간 14일 · 압축형")).toBeVisible();
  await expect(page.getByText("D-14").first()).toBeVisible();
  await expect(page.getByText("완료").first()).toBeVisible();
});
