import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("franchise page shows direct cohort and deopdeopbap detail", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/franchise`);
  await expect(page.getByRole("heading", { name: "덮덮밥", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "핵밥", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "덮밥장사장", exact: true })).toBeVisible();
  await expect(page.getByText("돈까스 비교군", { exact: true })).toBeVisible();
  await expect(page.getByText("삼겹살 참고군", { exact: true })).toBeVisible();
  await expect(page.getByText("수익 보장")).toHaveCount(0);
});
