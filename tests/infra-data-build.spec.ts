import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("build page shows infra execution candidates", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/build`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "큐플레이스" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "주방24" })).toBeVisible();
  await expect(page.getByText("920,000원")).toBeVisible();
  await expect(page.getByText("업소용 인덕션 전기 렌지 디포인덕션 BKP20 매립형 1구")).toBeVisible();
  await expect(page.getByRole("cell", { name: "전화상담/견적 필요", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "레드프린팅 앤 프레스" })).toBeVisible();

  const officialLink = page.getByRole("link", { name: "공식 페이지 열기" }).first();
  await expect(officialLink).toHaveAttribute("target", "_blank");
  await expect(officialLink).toHaveAttribute("rel", /noopener/);
});
