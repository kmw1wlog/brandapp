import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("rfp page renders printable package and copies message", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
  await page.goto(`${baseURL}/dashboard/startup/consultation/rfp`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: /견적 요청서/ })).toBeVisible();
  await expect(page.locator("img").first()).toBeVisible();
  await expect(page.getByText("주방설비·동선 요구사항")).toBeVisible();
  await expect(page.getByText("상담 질문 체크리스트")).toBeVisible();
  await expect(page.getByRole("button", { name: "PDF로 인쇄" })).toBeVisible();

  await page.getByRole("button", { name: "상담사에게 보낼 메시지 복사" }).click();
  await expect(page.getByRole("button", { name: "복사 완료" })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("견적");
});
