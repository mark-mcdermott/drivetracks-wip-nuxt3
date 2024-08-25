import fs from 'node:fs'
import path from 'node:path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { expect } from 'vitest'

export async function testHeaderLinks(page) {
  const mainNav = await page.locator('header nav.header-main-nav')
  const loginNav = await page.locator('header .header-login-nav')
  const homeLink = await mainNav.locator('a[href="/"]')
  const publicLink = await mainNav.locator('a[href="/public"]')
  const privateLink = await mainNav.locator('a[href="/private"]')
  const loginLink = await loginNav.locator('a[href="/login"]')
  const signupLink = await loginNav.locator('a[href="/signup"]')

  expect(await homeLink.textContent()).toContain('Home')
  expect(await publicLink.textContent()).toContain('Public')
  expect(await privateLink.textContent()).toContain('Private')
  expect(await loginLink.textContent()).toContain('Log in')
  expect(await signupLink.textContent()).toContain('Sign up')
}

export async function testFooterText(page) {
  const p = await page.locator('footer p')
  const pText = await p.textContent()
  expect(await p.isVisible()).toBe(true)
  expect(pText).toContain('© 2024. Made with Nuxt, Tailwind, UI Thing, Rails, Fly.io and S3.')
}

export async function compareScreenshotWithBaseline(page, baselineName, diffName) {
  // Capture the screenshot
  const screenshotPath = path.resolve(__dirname, 'screenshots', 'current', `${baselineName}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: true })

  // Load baseline image
  const baselinePath = path.resolve(__dirname, 'screenshots', 'baseline', `${baselineName}.png`)
  if (!fs.existsSync(baselinePath)) {
    console.warn(`Baseline image not found for ${baselineName}, saving current screenshot as baseline.`)
    fs.mkdirSync(path.dirname(baselinePath), { recursive: true })
    fs.copyFileSync(screenshotPath, baselinePath)
    return
  }

  const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath))
  const currentImg = PNG.sync.read(fs.readFileSync(screenshotPath))

  // Compare the images
  const { width, height } = baselineImg
  const diff = new PNG({ width, height })
  const numDiffPixels = pixelmatch(baselineImg.data, currentImg.data, diff.data, width, height, { threshold: 0.1 })

  // If images don't match, save the diff
  if (numDiffPixels > 0) {
    const diffPath = path.resolve(__dirname, 'screenshots', 'diff', `${diffName}.png`)
    fs.mkdirSync(path.dirname(diffPath), { recursive: true })
    fs.writeFileSync(diffPath, PNG.sync.write(diff))
  }

  // Assert that the number of different pixels is within the acceptable threshold
  expect(numDiffPixels).toBe(0)
}