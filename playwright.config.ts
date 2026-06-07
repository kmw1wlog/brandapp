import { defineConfig } from "playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  globalSetup: "./tests/global-setup.ts",
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: process.env.BASE_URL ?? "http://127.0.0.1:3003",
    trace: "on-first-retry"
  }
});
