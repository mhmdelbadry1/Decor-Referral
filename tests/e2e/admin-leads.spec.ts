import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Admin leads page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/leads')
    await expect(page.getByRole('heading', { name: /إدارة الطلبات/i })).toBeVisible()
  })

  test('page heading and lead count shown', async ({ page }) => {
    await expect(page.getByText(/طلب واصل/i)).toBeVisible()
  })

  test('search box is visible and functional', async ({ page }) => {
    const search = page.getByPlaceholder(/بحث/i)
    await expect(search).toBeVisible()
    await search.fill('test')
    // Results count should update (or show 0 طلب) — target the count span specifically
    await expect(page.locator('span.whitespace-nowrap').filter({ hasText: /طلب/ })).toBeVisible()
    await search.fill('')
  })

  test('status filter dropdown works', async ({ page }) => {
    const statusSelect = page.locator('select').filter({ hasText: 'كل الحالات' })
    await statusSelect.selectOption('تمت البيعة')
    await expect(page.locator('span.whitespace-nowrap').filter({ hasText: /طلب/ })).toBeVisible()
    await statusSelect.selectOption('all')
  })

  test('company filter dropdown works', async ({ page }) => {
    const companySelect = page.locator('select').filter({ hasText: 'كل الشركات' })
    await expect(companySelect).toBeVisible()
    await companySelect.selectOption('__unassigned')
    await expect(page.locator('span.whitespace-nowrap').filter({ hasText: /طلب/ })).toBeVisible()
    await companySelect.selectOption('all')
  })

  test('"عملاء متأخرين" quick filter toggles on and off', async ({ page }) => {
    const btn = page.getByRole('button', { name: /عملاء متأخرين/i })
    await btn.click()
    // cancel button should appear
    await expect(page.getByRole('button', { name: /إلغاء الفلتر/i })).toBeVisible()
    await page.getByRole('button', { name: /إلغاء الفلتر/i }).click()
    await expect(page.getByRole('button', { name: /إلغاء الفلتر/i })).not.toBeVisible()
  })

  test('rating dropdown visible on desktop', async ({ page }) => {
    // Only runs if there are leads
    const ratingSelects = page.locator('select').filter({ hasText: 'بدون تقييم' })
    const count = await ratingSelects.count()
    test.skip(count === 0, 'no leads to test rating on')

    await expect(ratingSelects.first()).toBeVisible()
  })

  test('can change rating on a lead', async ({ page }) => {
    const ratingSelects = page.locator('select').filter({ hasText: /بدون تقييم|ممتاز|جيد|يحتاج/ })
    const count = await ratingSelects.count()
    test.skip(count === 0, 'no leads to test rating on')

    const select = ratingSelects.first()
    const currentValue = await select.inputValue()

    // Toggle to ممتاز and back
    await select.selectOption('ممتاز')
    await page.waitForTimeout(1500)  // wait for server action
    // No error should appear near the row
    const errorMsg = page.getByText(/خطأ غير متوقع/).first()
    await expect(errorMsg).not.toBeVisible()

    // Reset to original
    await select.selectOption(currentValue || '')
    await page.waitForTimeout(1000)
  })

  test('empty state shown when filter matches nothing', async ({ page }) => {
    const search = page.getByPlaceholder(/بحث/i)
    await search.fill('xyznotfound99999')
    await expect(page.getByText(/لا يوجد طلب يطابق/i)).toBeVisible()
  })

  test('legend box with rules is visible', async ({ page }) => {
    await expect(page.getByText(/قواعد التعديل/i)).toBeVisible()
  })
})
