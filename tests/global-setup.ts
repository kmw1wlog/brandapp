import { chromium } from "playwright";

export default async function globalSetup() {
  const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3003";
  const routes = [
    "/dashboard/startup/new",
    "/dashboard/startup/brand",
    "/dashboard/startup/franchise",
    "/dashboard/startup/cost",
    "/dashboard/startup/suppliers",
    "/dashboard/startup/build",
    "/dashboard/startup/timetable",
    "/dashboard/startup/consultation",
    "/dashboard/startup/consultation/status",
    "/dashboard/startup/owner-preview"
  ];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  }

  await browser.close();
}
