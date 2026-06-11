import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("onboarding landing shows core flow and category image preview", async ({ page }) => {
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/onboarding$/);

  await expect(page.getByRole("link", { name: "b 브랜치" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /프랜차이즈 상담 전에/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "육반장" }).first()).toBeVisible();

  await page.getByRole("button", { name: "🧁 디저트" }).click();
  await expect(page.getByRole("heading", { name: "오븐스텝" }).first()).toBeVisible();
  await expect(page.getByAltText("오븐스텝 대표 이미지")).toBeVisible();

  await expect(page.getByText("브랜치에서 확인할 수 있는 창업 비교 여정")).toBeVisible();
  await expect(page.getByText("목표 개점일까지,")).toBeVisible();
  await expect(page.getByText("상담 질문지까지 만들어줍니다.")).toBeVisible();
  await expect(page.getByText("메뉴 개발도")).toBeVisible();
  await expect(page.getByText("더 싸게 살 수 있는 공급처와 공동구매 후보를 모읍니다.")).toBeVisible();
  await expect(page.getByText("개점 후 1~4개월을 시뮬레이션합니다.")).toBeVisible();
  await expect(page.getByText("운영 대시보드를")).toBeVisible();

  const cta = page.getByRole("link", { name: "내 브랜드 만들고 창업 준비하기" });
  await cta.scrollIntoViewIfNeeded();
  await expect(cta).toBeVisible();
});
