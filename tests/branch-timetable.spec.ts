import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("owner timetable saves target date and task status", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/timetable`, { waitUntil: "networkidle" });
  await expect(page.getByText("타임라인 진행률")).toBeVisible();
  await page.getByRole("button", { name: "진행 중" }).first().click();
  await page.getByRole("button", { name: "저장" }).click();
  await expect(page.getByText("저장 완료")).toBeVisible();

  const timeline = await page.evaluate(() => JSON.parse(window.localStorage.getItem("branch_timeline_v3") ?? "{}"));
  expect(timeline.version).toBe(3);
  expect(Object.keys(timeline.tasks).length).toBeGreaterThan(0);
});
