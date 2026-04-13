import { defineConfig, devices } from "@playwright/test";

import { E2E_APP_URL, E2E_AUTH_SECRET, E2E_DB_PATH } from "./tests/e2e/config";

process.env.APP_URL = E2E_APP_URL;
process.env.AUTH_SECRET = E2E_AUTH_SECRET;
process.env.DB_PATH = E2E_DB_PATH;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [["html"], ["github"]] : "html",
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: E2E_APP_URL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "node ./tests/e2e/setup/start-server.mjs",
    reuseExistingServer: false,
    url: E2E_APP_URL,
  },
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
