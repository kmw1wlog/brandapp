import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("assistant widget opens and returns a reply", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/location`);
  await page.locator("[data-testid='assistant-open-button']").click();
  await expect(page.locator("[data-testid='assistant-widget']")).toBeVisible();
  await page.getByRole("button", { name: "이 화면에서 입지 비교는 어떤 순서로 봐야 하나?" }).click();
  await expect(page.locator("[data-testid='assistant-widget']")).toContainText("입지");
});
