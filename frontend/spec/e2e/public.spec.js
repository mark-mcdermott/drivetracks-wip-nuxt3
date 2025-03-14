import { test, expect } from '@playwright/test'
import { compareScreenshot, verifyHeaderDetails, verifyFooterDetails } from './shared'

test.describe('Public Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/public')
  })

  test('links correctly from homepage', async ({ page }) => {
    const homePage = await page.context().newPage()
    await homePage.goto('/')
    const publicLink = await homePage.locator('a[href="/public"]')
    await publicLink.click()
    await page.waitForLoadState('load')
    expect(page.url()).toContain('/public')
    const h1 = (await page.locator('h1'))
    await expect(h1).not.toHaveText('404')
  })

  test('has correct header links', async ({ page }) => {
    await verifyHeaderDetails(page, expect)
  })

  test('displays the correct first p tag text', async ({ page }) => {
    const firstP = page.locator('.page p').first()
    expect(await firstP.isVisible()).toBe(true)
    const firstPText = (await firstP.textContent()).trim()
    expect(firstPText).toContain(
      'Looked at from one side, the wall enclosed a barren sixty-acre field called the Port of Anarres. On the field there were a couple of large gantry cranes, a rocket pad, three warehouses, a truck garage, and a dormitory. The dormitory looked durable, grimy, and mournful; it had no gardens, no children; plainly nobody lived there or was even meant to stay there long. It was in fact a quarantine. The wall shut in not only the landing field but also the ships that came down out of space, and the men that came on the ships, and the worlds they came from, and the rest of the universe. It enclosed the universe, leaving Anarres outside, free.'
    )
  })

  test('displays the correct second p tag text', async ({ page }) => {
    const secondP = page.locator('.page p').nth(1)
    await page.waitForSelector('.page p:nth-child(2)', { state: 'visible' })
    expect(await secondP.isVisible()).toBe(true)
    const secondPText = (await secondP.textContent()).trim()
    expect(secondPText).toMatch(/Looked at from the other side/i)
  })

  test('has correct footer text', async ({ page }) => {
    await verifyFooterDetails(page, expect)
  })

  test('current screenshot matches baseline', async ({ page, browserName }) => {
    const pixelDiffCount = await compareScreenshot(page, 'public', { browserName, targetUrl: '/public' });
    expect(pixelDiffCount).toBeLessThan(200)
  });
})