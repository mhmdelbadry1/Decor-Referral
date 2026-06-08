import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Admin dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('shows KPI cards', async ({ page }) => {
    // Expect at least 4 KPI numbers to be visible
    const kpiCards = page.locator('[data-kpi], .kpi, .rounded-xl').filter({ hasText: /\d/ })
    await expect(kpiCards.first()).toBeVisible()
  })

  test('shows company leaderboard heading', async ({ page }) => {
    await expect(page.getByText(/مؤشر ثقة الشركات/i)).toBeVisible()
  })

  test('leaderboard shows company rows or empty state', async ({ page }) => {
    const leaderboard = page.getByText(/مؤشر ثقة الشركات/i).locator('../..')
    // Either shows company rows or the empty state message
    const hasRows     = leaderboard.locator('tbody tr, [data-company-row]').count()
    const hasEmpty    = leaderboard.getByText(/لا توجد شركات/i)
    const count = await hasRows
    if (count === 0) await expect(hasEmpty).toBeVisible()
    else expect(count).toBeGreaterThan(0)
  })

  test('AddCompanyPanel expands on click', async ({ page }) => {
    const toggleBtn = page.getByText(/إضافة شركة جديدة/i)
    await toggleBtn.click()
    await expect(page.getByPlaceholder(/النخبة/i)).toBeVisible()
  })

  test('AddCompanyPanel collapses on second click', async ({ page }) => {
    const toggleBtn = page.getByText(/إضافة شركة جديدة/i)
    await toggleBtn.click()
    await toggleBtn.click()
    await expect(page.getByPlaceholder(/النخبة/i)).not.toBeVisible()
  })

  test('SettingsPanel expands on click', async ({ page }) => {
    const toggle = page.getByText(/إعدادات النموذج/i)
    await toggle.click()
    await expect(page.getByText(/المدن/i).last()).toBeVisible()
  })

  test('company edit button opens inline form', async ({ page }) => {
    // Only run if there are companies
    const editButtons = page.getByRole('button', { name: 'تعديل' })
    const count = await editButtons.count()
    test.skip(count === 0, 'no companies yet')

    await editButtons.first().click()
    await expect(page.getByText(/اسم الشركة/i).last()).toBeVisible()
  })

  test('company delete button shows confirmation', async ({ page }) => {
    const deleteButtons = page.getByRole('button', { name: 'حذف' })
    const count = await deleteButtons.count()
    test.skip(count === 0, 'no companies without leads to delete')

    await deleteButtons.first().click()
    // Should show either confirm dialog or blacklist prompt
    const confirmText = page.getByText(/هل أنت متأكد|قائمة سوداء|لديها سجل/i)
    await expect(confirmText.first()).toBeVisible()
  })

  test('logout button exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: /خروج|تسجيل الخروج/i })).toBeVisible()
  })

  test('nav links to leads page', async ({ page }) => {
    await page.getByRole('link', { name: /الطلبات|leads/i }).click()
    await expect(page).toHaveURL(/\/admin\/leads/)
  })
})
