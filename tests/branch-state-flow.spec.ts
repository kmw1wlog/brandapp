import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3003";

test("brand and operating type state persist in local storage", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/brand`);
  await page.getByRole("button", { name: /육반장/ }).click();
  await page.getByRole("button", { name: "배달형으로 바꾸기" }).click();
  await expect(page.locator("img").first()).toBeVisible();

  const selectedBrand = await page.evaluate(() => JSON.parse(window.localStorage.getItem("branch_selected_brand_v2") ?? "\"\""));
  expect(selectedBrand).toBe("brand_yukbanjang");
});

test("consultation booking updates appointment storage", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/consultation?category=%EC%8B%9C%EA%B3%B5%EC%82%AC&taskId=task_004`);
  await page.getByLabel("연락처 또는 이메일").fill("demo@example.com");
  await page.getByRole("button", { name: /상담 슬롯 예약 가능/ }).first().click();
  await page.getByRole("button", { name: "이 슬롯 예약" }).click();
  await expect(page.getByText("예약이 저장되었습니다")).toBeVisible();

  const appointments = await page.evaluate(() => JSON.parse(window.localStorage.getItem("branch_appointments_v3") ?? "[]"));
  expect(appointments.length).toBeGreaterThan(0);
  expect(appointments[0].taskId).toBe("task_004");
});
