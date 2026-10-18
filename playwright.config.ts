import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: 'http://localhost:9100' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // Own port so a dev server running against the LiteAPI sandbox is never reused.
    command: 'pnpm exec quasar dev --port 9100',
    url: 'http://localhost:9100',
    reuseExistingServer: false,
    env: { HOTEL_ADAPTER: 'mock' },
  },
})
