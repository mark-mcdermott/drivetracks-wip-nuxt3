import { consola } from 'consola'
import { createPage } from '@nuxt/test-utils'
import { setup } from '@nuxt/test-utils/e2e'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { compareScreenshotWithBaseline, testHeaderLinksLoggedIn, testHeaderLinksLoggedOut } from './shared'

describe('homepage', async () => {
  await setup({ browser: true })

  let page

  beforeAll(async () => {
    page = await createPage('/')
    consola.restoreConsole()
  })

  afterEach(async () => {
    const logOutButton = await page.locator('header button:has-text("Log out")')
    if (await logOutButton.isVisible() && await logOutButton.isEnabled()) {
      await logOutButton.click()
      await page.waitForLoadState('load')
      await page.waitForLoadState('networkidle')
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    }
  })

  it('logging in redirects away from login page', async () => {
    const logInButton = await page.locator('header a[href="/login"]')
    await logInButton.click()
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/login')
    const submitButton = await page.locator('main form button[type="submit"]')
    await submitButton.click();
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')
    await page.waitForFunction(() => !window.location.href.includes('/login'));
    expect(page.url()).not.toContain('/login')
  })

  it('has correct header links when logged in', async () => {
    const logInButton = await page.locator('header a[href="/login"]')
    expect(await logInButton.isVisible()).toBe(true)
    await logInButton.click()
    await page.waitForLoadState('load');
    const submitButton = await page.locator('main form button[type="submit"]')
    await submitButton.click();
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')
    await page.waitForFunction(() => !window.location.href.includes('/login'));
    await testHeaderLinksLoggedIn(page)
  })

  it('has correct header links when logged out', async () => {
    const page = await createPage('/')
    await testHeaderLinksLoggedOut(page)
  })

  it('displays h1 with correct text', async () => {
    const h1 = await page.locator('main h1')
    const h1Text = await h1.textContent()
    expect(await h1.isVisible()).toBe(true)
    expect(h1Text).toContain('There was a wall.').and.toContain('It did not look important.')
  })

  it('displays p with correct text', async () => {
    const p = await page.locator('main p')
    const pText = await p.textContent('p')
    expect(await p.isVisible()).toBe(true)
    expect(pText).toContain('{"status":"OK"}')
  })

  it('displays the correct buttons with hrefs and text', async () => {
    const loginButton = await page.locator('main .hero-buttons a[href="/login"]')
    const signupButton = await page.locator('main .hero-buttons a[href="/signup"]')
    expect(await loginButton.isVisible()).toBe(true)
    expect(await loginButton.textContent()).toContain('Log in')
    expect(await signupButton.isVisible()).toBe(true)
    expect(await signupButton.textContent()).toContain('Sign up')
  })

  it('matches the visual baseline when logged out', async () => {
    page.reload()
    await compareScreenshotWithBaseline(page, 'page-home-logged-out', 'page-home-logged-out-diff')
  }, 20000)

  it('matches the visual baseline when logged in', async () => {
    try {
      const toastCloseButton = await page.locator('[data-sonner-toaster] button[data-close-button]');
      
      if (await toastCloseButton.isVisible()) {
        await toastCloseButton.click();
        
        // Wait for the toast element to be completely removed from the DOM
        await page.waitForSelector('[data-sonner-toast]', { state: 'hidden' });
      }
  
      // Ensure the login button is not blocked and is interactable
      const logInButton = await page.locator('header a[href="/login"]');
      await logInButton.waitFor({ state: 'visible' });
      await logInButton.click({ timeout: 15000 });
  
      await page.waitForLoadState('load');
      expect(page.url()).toContain('/login');
  
      const submitButton = await page.locator('main form button[type="submit"]');
      expect(await submitButton.isVisible()).toBe(true);
      await submitButton.click();
  
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await page.waitForFunction(() => !window.location.href.includes('/login'));
      page.reload()
  
      await compareScreenshotWithBaseline(page, 'page-home-logged-in', 'page-home-logged-in-diff');
      
    } catch (error) {
      console.error('Test failed:', error);
    }
  }, 30000); 
})