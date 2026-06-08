import { defineConfig, devices } from '@playwright/test'
import path from 'path'

export default defineConfig({
  testDir : './tests/e2e',
  timeout : 30_000,
  retries : process.env.CI ? 2 : 0,

  use: {
    baseURL         : 'http://localhost:3000',
    trace           : 'on-first-retry',
    screenshot      : 'only-on-failure',
    locale          : 'ar-SA',
  },

  projects: [
    {
      name: 'chromium',
      use : { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command            : 'npm run dev',
    url                : 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout            : 120_000,
    env                : {
      SUPABASE_URL            : process.env.SUPABASE_URL            ?? '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
      ADMIN_SECRET            : process.env.ADMIN_SECRET            ?? '',
    },
  },
})
