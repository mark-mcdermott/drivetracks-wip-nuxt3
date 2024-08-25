import { createPage } from '@nuxt/test-utils'
import { setup } from '@nuxt/test-utils/e2e'
import { beforeAll, describe, expect, it } from 'vitest'
import { compareScreenshotWithBaseline, testFooterText, testHeaderLinks } from './shared'

describe('homepage', async () => {
  await setup({ browser: true })

  let page

  beforeAll(async () => {
    page = await createPage('/')
  })

  it('has correct header links', async () => {
    const page = await createPage('/')
    testHeaderLinks(page)
  })

  it('displays h1 with correct text', async () => {
    const page = await createPage('/')
    const h1 = await page.locator('main h1')
    const h1Text = await h1.innerHTML()
    expect(await h1.isVisible()).toBe(true)
    expect(h1Text).toContain('There was a wall.').and.toContain('It did not look important.')
  })

  it('displays p with correct text', async () => {
    const page = await createPage('/')
    const p = await page.locator('main p')
    const pText = await p.innerHTML('p')
    expect(await p.isVisible()).toBe(true)
    expect(pText).toContain('It was built of uncut rocks roughly mortared. An adult could look right over it, and even a child could climb it. Where it crossed the roadway, instead of having a gate it degenerated into mere geometry, a line, an idea of boundary. But the idea was real.')
  })

  it('displays the correct buttons with hrefs and text', async () => {
    const homePage = await createPage('/')
    const main = await homePage.locator('main')
    const loginButton = await main.locator('.hero-buttons a[href="/login"]')
    const signupButton = await main.locator('.hero-buttons a[href="/signup"]')
    expect(await loginButton.isVisible()).toBe(true)
    expect(await loginButton.textContent()).toContain('Log in')
    expect(await signupButton.isVisible()).toBe(true)
    expect(await signupButton.textContent()).toContain('Sign up')
  })

  it('has correct footer text', async () => {
    const page = await createPage('/')
    testFooterText(page)
  })

  it('matches the visual baseline', async () => {
    const homePage = await createPage('/')
    await compareScreenshotWithBaseline(homePage, 'page-home', 'page-home-diff')
  }, 20000)
})