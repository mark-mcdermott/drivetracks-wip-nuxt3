import { createPage } from '@nuxt/test-utils'
import { setup } from '@nuxt/test-utils/e2e'
import { beforeAll, describe, expect, it } from 'vitest'
import { compareScreenshotWithBaseline, testFooterText, testHeaderLinks } from './shared'

describe('private page', async () => {
  await setup({ browser: true })

  let page

  beforeAll(async () => {
    page = await createPage('/private')
  })

  it('links correctly from homepage', async () => {
    const homePage = await createPage('/')
    const privateLink = await homePage.locator('a[href="/private"]')
    await privateLink.click()
    await page.waitForLoadState('load')
    expect(page.url()).toContain('/private')
  })

  it('has correct header links', async () => {
    await testHeaderLinks(page)
  })

  it('displays the correct h1 text', async () => {
    await page.waitForSelector('.page h1', { state: 'visible', timeout: 10000 })
    const h1 = page.locator('.page h1')
    expect(await h1.isVisible()).toBe(true)
    expect(await h1.textContent()).toContain('Private')
  })

  it('displays the correct p tag text', async () => {
    await page.waitForSelector('.page p', { state: 'visible', timeout: 10000 })
    const p = page.locator('.page p')
    expect(await p.isVisible()).toBe(true)
    expect(await p.textContent()).toContain('A number of people were coming along the road towards the landing field, or standing around where the road cut through the wall. People often came out from the nearby city of Abbenay in hopes of seeing a spaceship, or simply to see the wall. After all, it was the only boundary wall on their world. Nowhere else could they see a sign that said No Trespassing. Adolescents, particularly, were drawn to it. They came up to the wall; they sat on it. There might be a gang to watch, offloading crates from track trucks at the warehouses. There might even be a freighter on the pad. Freighters came down only eight times a year, unannounced except to syndics actually working at the Port, so when the spectators were lucky enough to see one they were excited, at first. But there they sat, and there it sat, a squat black tower in a mess of movable cranes, away off across the field. And then a woman came over from one of the warehouse crews and said, “We’re shutting down for today, brothers.” She was wearing the Defense armband, a sight almost as rare as a spaceship. That was a bit of a thrill. But though her tone was mild, it was final. She was the foreman of this gang, and if provoked would be backed up by her syndics. And anyhow there wasn’t anything to see. The aliens, the offworlders, stayed hiding in their ship. No show.')
  })

  it('has correct footer text', async () => {
    await testFooterText(page)
  })

  it('matches the visual baseline', async () => {
    await compareScreenshotWithBaseline(page, 'page-private', 'page-private-diff')
  }, 20000)
})