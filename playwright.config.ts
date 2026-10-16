import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: 'http://localhost:9000' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:9000',
    reuseExistingServer: true,
    env: { HOTEL_ADAPTER: 'mock' },
  },
})
