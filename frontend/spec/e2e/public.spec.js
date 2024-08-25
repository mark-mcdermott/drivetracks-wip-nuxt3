import { createPage } from '@nuxt/test-utils'
import { setup } from '@nuxt/test-utils/e2e'
import { beforeAll, describe, expect, it } from 'vitest'
import { compareScreenshotWithBaseline, testFooterText, testHeaderLinks } from './shared'

describe('public', async () => {
  await setup({ browser: true })

  let page

  beforeAll(async () => {
    page = await createPage('/public')
  })

  it('links correctly from homepage', async () => {
    const homePage = await createPage('/')
    const publicLink = await homePage.locator('a[href="/public"]')
    await publicLink.click()
    await page.waitForLoadState('load')
    expect(page.url()).toContain('/public')
  })

  it('has correct header links', async () => {
    testHeaderLinks(page)
  })

  it('displays the correct h1 text', async () => {
    const h1 = page.locator('.page h1')
    await page.waitForSelector('.page h1', { state: 'visible' })
    expect(await h1.isVisible()).toBe(true)
    expect(await h1.textContent()).toContain('Public')
  })

  it('displays the correct first p tag text', async () => {
    await page.waitForTimeout(2000)
    const firstP = page.locator('.page p').first()
    expect(await firstP.isVisible()).toBe(true)
    expect(await firstP.textContent()).toContain('Looked at from one side, the wall enclosed a barren sixty-acre field called the Port of Anarres. On the field there were a couple of large gantry cranes, a rocket pad, three warehouses, a truck garage, and a dormitory. The dormitory looked durable, grimy, and mournful; it had no gardens, no children; plainly nobody lived there or was even meant to stay there long. It was in fact a quarantine. The wall shut in not only the landing field but also the ships that came down out of space, and the men that came on the ships, and the worlds they came from, and the rest of the universe. It enclosed the universe, leaving Anarres outside, free.')
  })

  it('displays the correct second p tag text', async () => {
    const secondP = page.locator('.page p').nth(1)
    await page.waitForSelector('.page p:nth-child(2)', { state: 'visible' })
    expect(await secondP.isVisible()).toBe(true)
    const secondPText = (await secondP.textContent()).trim()
    expect(secondPText).toMatch(/Looked at from the other side/i)
  })

  it('has correct footer text', async () => {
    await testFooterText(page)
  })

  it('matches the visual baseline', async () => {
    await compareScreenshotWithBaseline(page, 'page-public', 'page-public-diff')
  }, 20000)
})