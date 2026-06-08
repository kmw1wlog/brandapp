import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("location profile page renders linked SBIZ365 workspace", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/location`);

  await expect(page.getByRole("heading", { name: "입지 분석", exact: true })).toBeVisible();
  await expect(page.getByText("실제 API 연동", { exact: true })).toBeVisible();
  await expect(page.getByText("정규화 캐시", { exact: true })).toBeVisible();
  await expect(page.getByText("605건", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "후보 입지 랭킹", exact: true })).toBeVisible();
  await expect(page.getByText("추천 입지", { exact: true })).toBeVisible();
  await expect(page.locator("[data-testid='location-candidate-list'] button")).toHaveCount(5);
  await expect(page.locator("[data-testid='sbiz365-iframe']")).toHaveCount(1);
  await expect(page.locator("[data-testid='sbiz365-iframe']")).toHaveAttribute("src", /bigdata\.sbiz\.or\.kr\/gis\/openApi\/simple/);
  await expect(page.getByRole("heading", { name: "브랜치 후보 지도", exact: true })).toBeVisible();
  await expect(page.locator("[data-testid='kakao-location-map']")).toHaveCount(1);
  await expect(page.locator("[data-testid='assistant-open-button']")).toBeVisible();

  const frame = page.frameLocator("[data-testid='sbiz365-iframe']");
  await expect(frame.getByText("간단분석").first()).toBeVisible();
  await expect(page.locator("[data-testid='location-ranking-table']")).toContainText("후보 입지 랭킹");
});
