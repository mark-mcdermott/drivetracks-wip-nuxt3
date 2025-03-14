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