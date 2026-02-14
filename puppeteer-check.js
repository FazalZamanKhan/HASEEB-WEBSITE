const puppeteer = require('puppeteer');

const url = 'http://localhost:8000';
const viewports = [
  { name: 'iPhone_SE', width: 375, height: 667 },
  { name: 'Pixel_3', width: 393, height: 852 },
  { name: 'Small_360', width: 360, height: 780 }
];

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const results = [];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    } catch (e) {
      results.push({ viewport: vp.name, error: 'Navigation failed: ' + String(e) });
      continue;
    }

    const data = await page.evaluate(() => {
      const qs = sel => document.querySelector(sel);
      const cs = (el, prop) => el ? window.getComputedStyle(el).getPropertyValue(prop) : null;

      const heroTitle = qs('.hero-title');
      const navLinks = qs('.nav-links');
      const hamburger = qs('.hamburger');
      const heroVideo = qs('.hero-video');
      const productsGrid = qs('.products-grid');
      const contactGrid = qs('.contact-grid');

      return {
        heroTitleFontSize: cs(heroTitle, 'font-size'),
        heroTitleWhiteSpace: cs(heroTitle, 'white-space'),
        navLinksDisplay: cs(navLinks, 'display'),
        navLinksPosition: cs(navLinks, 'position'),
        hamburgerDisplay: cs(hamburger, 'display'),
        heroVideoDisplay: cs(heroVideo, 'display'),
        productsGridTemplate: cs(productsGrid, 'grid-template-columns'),
        contactGridTemplate: cs(contactGrid, 'grid-template-columns')
      };
    });

    // also take a screenshot named by viewport
    const screenshotPath = `puppeteer-${vp.name}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });

    results.push({ viewport: vp.name, width: vp.width, height: vp.height, checks: data, screenshot: screenshotPath });
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
})();
