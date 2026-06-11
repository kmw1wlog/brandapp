import { chromium } from "playwright";

export default async function globalSetup() {
  const baseURL = process.env.BASE_URL ?? "http://localhost:3003";
  const routes = [
    "/onboarding",
    "/dashboard/startup/input",
    "/dashboard/startup/location",
    "/dashboard/startup/new",
    "/dashboard/startup/brand",
    "/dashboard/startup/finance",
    "/dashboard/startup/cost",
    "/dashboard/startup/suppliers",
    "/dashboard/startup/build",
    "/dashboard/startup/timetable",
    "/dashboard/startup/consultation",
    "/dashboard/startup/consultation/rfp",
    "/dashboard/startup/owner-conversion",
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
