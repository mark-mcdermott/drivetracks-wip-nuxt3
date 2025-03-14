import { test, expect } from '@playwright/test'
import { compareScreenshot, verifyHeaderDetails, verifyFooterDetails } from './shared'

test.describe('Private Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/private')
  })

  test('links correctly from homepage', async ({ page }) => {
    const homePage = await page.context().newPage()
    await homePage.goto('/')
    const privateLink = await homePage.locator('a[href="/private"]')
    await privateLink.click()
    await page.waitForLoadState('load')
    expect(page.url()).toContain('/private')
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
      'A number of people were coming along the road towards the landing field, or standing around where the road cut through the wall. People often came out from the nearby city of Abbenay in hopes of seeing a spaceship, or simply to see the wall. After all, it was the only boundary wall on their world. Nowhere else could they see a sign that said No Trespassing. Adolescents, particularly, were drawn to it. They came up to the wall; they sat on it. There might be a gang to watch, offloading crates from track trucks at the warehouses. There might even be a freighter on the pad. Freighters came down only eight times a year, unannounced except to syndics actually working at the Port, so when the spectators were lucky enough to see one they were excited, at first. But there they sat, and there it sat, a squat black tower in a mess of movable cranes, away off across the field. And then a woman came over from one of the warehouse crews and said, “We’re shutting down for today, brothers.” She was wearing the Defense armband, a sight almost as rare as a spaceship. That was a bit of a thrill. But though her tone was mild, it was final. She was the foreman of this gang, and if provoked would be backed up by her syndics. And anyhow there wasn’t anything to see. The aliens, the offworlders, stayed hiding in their ship. No show.'
    )
  })

  test('has correct footer text', async ({ page }) => {
    await verifyFooterDetails(page, expect)
  })

  test('current screenshot matches baseline', async ({ page, browserName }) => {
    const pixelDiffCount = await compareScreenshot(page, 'private', { browserName, targetUrl: '/public' });
    expect(pixelDiffCount).toBeLessThan(200)
  });
})