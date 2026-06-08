import { test, expect } from '@playwright/test'
import { ADMIN_PASSWORD } from './helpers/auth'

test.describe('Admin login', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('shows login form', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.getByRole('heading')).toBeVisible()
    await expect(page.getByRole('button', { name: /دخول|تسجيل/i })).toBeVisible()
  })

  test('shows error for wrong password', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/كلمة المرور|password/i).fill('wrong-password-123')
    await page.getByRole('button', { name: /دخول|تسجيل/i }).click()
    // Should stay on login page with an error
    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.locator('p[role="alert"]')).toBeVisible()
  })

  test('logs in with correct password and redirects to dashboard', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/كلمة المرور|password/i).fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /دخول|تسجيل/i }).click()
    await expect(page).toHaveURL(/\/admin\/dashboard/)
    await expect(page.getByRole('heading', { name: /لوحة التحكم/i })).toBeVisible()
  })
})
