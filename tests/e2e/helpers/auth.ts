import { type Page } from '@playwright/test'

export const ADMIN_PASSWORD = process.env.ADMIN_SECRET ?? ''

/** Log in as admin and land on /admin/dashboard */
export async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login')
  await page.getByLabel(/كلمة المرور|password/i).fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /دخول|تسجيل/i }).click()
  await page.waitForURL('**/admin/dashboard')
}
