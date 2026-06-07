import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("consultation page maps real infra candidates by category", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/consultation`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "시공사 상담" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "큐플레이스" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "숨고" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "배달 상담" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "바로고" })).toBeVisible();

  const officialLink = page.getByRole("link", { name: "공식 페이지 열기" }).first();
  await expect(officialLink).toHaveAttribute("target", "_blank");
});
