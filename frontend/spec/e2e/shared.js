// shared.js
import { promises as fs } from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

// Sets baseline directory based on environment
const getBaselineDir = () => {
  const ciValue = process.env.CI || 'undefined'
  const dockerValue = process.env.DOCKER_ENV || 'undefined'
  console.log(`CI: ${ciValue}, DOCKER_ENV: ${dockerValue}`)
  if (process.env.CI === 'true') return 'spec/e2e/screenshots/baseline/ci'
  if (process.env.DOCKER_ENV === 'true') return 'spec/e2e/screenshots/baseline/docker'
  return 'spec/e2e/screenshots/baseline/local'
}

// Main function to compare screenshots, accepting a dynamic URL
export async function compareScreenshot(page, testName, { browserName = 'chromium', targetUrl }) {
  const baselineDir = getBaselineDir();
  const baselinePath = `${baselineDir}/${testName}.png`;
  const screenshotPath = `spec/e2e/screenshots/current/${testName}.png`;

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(targetUrl); // Use the provided target URL
  await fs.mkdir('spec/e2e/screenshots/current', { recursive: true });
  await page.screenshot({ path: screenshotPath });

  const baselineExists = await fs.access(baselinePath).then(() => true).catch(() => false);

  // Create baseline if not found
  if (!baselineExists && browserName === 'chromium') {
    console.log('Baseline image not found. Creating new baseline...');
    await fs.mkdir(baselineDir, { recursive: true });
    await fs.copyFile(screenshotPath, baselinePath);
    console.log('New baseline image created at:', baselinePath);
  }

  if (baselineExists) {
    const baselineImage = PNG.sync.read(await fs.readFile(baselinePath));
    const currentImage = PNG.sync.read(await fs.readFile(screenshotPath));

    const { width, height } = baselineImage;
    const diff = new PNG({ width, height });
    const pixelDiffCount = pixelmatch(
      baselineImage.data,
      currentImage.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );

    if (pixelDiffCount > 0) {
      const diffPath = `spec/e2e/screenshots/diff/${testName}-diff.png`;
      await fs.mkdir('spec/e2e/screenshots/diff', { recursive: true });
      await fs.writeFile(diffPath, PNG.sync.write(diff));
      console.log(`Difference found! Diff image saved at ${diffPath}`);
    }

    return pixelDiffCount;
  }

  return 0;
}

// Header details verification
export async function verifyHeaderDetails(page, expect) {
  const homeLink = page.getByTestId('header-link-home');
  const publicLink = page.getByTestId('header-link-public');
  const privateLink = page.getByTestId('header-link-private');

  await expect(homeLink).toBeVisible({ timeout: 30000 });
  await expect(homeLink).toHaveText('Home');
  await expect(homeLink).toHaveAttribute('href', '/');
  await expect(publicLink).toBeVisible();
  await expect(publicLink).toHaveText('Public');
  await expect(publicLink).toHaveAttribute('href', '/public');
  await expect(privateLink).toBeVisible();
  await expect(privateLink).toHaveText('Private');
  await expect(privateLink).toHaveAttribute('href', '/private');
}

// Footer details verification
export async function verifyFooterDetails(page, expect) {
  const footerP = page.getByTestId('footer-p');
  await expect(footerP).toBeVisible({ timeout: 30000 });
  await expect(footerP).toHaveText('© 2024. Made with Nuxt, Tailwind, UI Thing, Rails, Fly.io and S3.');

  const nuxtLink = footerP.locator('a', { hasText: 'Nuxt' });
  await expect(nuxtLink).toHaveAttribute('href', 'https://nuxt.com');
  const tailwindLink = footerP.locator('a', { hasText: 'Tailwind' });
  await expect(tailwindLink).toHaveAttribute('href', 'https://tailwindcss.com/');
  const uiThingLink = footerP.locator('a', { hasText: 'UI Thing' });
  await expect(uiThingLink).toHaveAttribute('href', 'https://ui-thing.behonbaker.com');
  const railsLink = footerP.locator('a', { hasText: 'Rails' });
  await expect(railsLink).toHaveAttribute('href', 'https://rubyonrails.org/');
  const flyLink = footerP.locator('a', { hasText: 'Fly.io' });
  await expect(flyLink).toHaveAttribute('href', 'https://fly.io');
  const s3Link = footerP.locator('a', { hasText: 'S3' });
  await expect(s3Link).toHaveAttribute('href', 'https://aws.amazon.com/s3/');
}

// TODO: Needs some more work
export async function logIn(page) {
  const logInButton = await page.locator('header a[href="/login"]')
  expect(await logInButton.isVisible()).toBe(true)
  await logInButton.click()
  await page.waitForLoadState('load');
  const submitButton = await page.locator('main form button[type="submit"]')
  await submitButton.click();
  await page.waitForLoadState('load')
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => !window.location.href.includes('/login'));
}