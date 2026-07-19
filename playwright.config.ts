import { defineConfig, devices } from "@playwright/test";

const localChannel = process.env.PLAYWRIGHT_CHANNEL as "chrome" | "msedge" | undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:43127",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], ...(localChannel ? { channel: localChannel } : {}) } },
  ],
  webServer: {
    command: "npm run start -- --port 43127",
    url: "http://localhost:43127",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
