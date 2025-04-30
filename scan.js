const puppeteer = require('puppeteer');
const axeSource = require('axe-core').source;
const { crawlSite } = require('./crawler');
const { writeReport } = require('./reporter');

const startUrl = process.argv[2];
if (!startUrl) {
  console.error('❌ Please provide a URL to scan.');
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const pagesToScan = await crawlSite(startUrl);
  const results = [];

  for (const url of pagesToScan) {
    console.log(`🔍 Scanning ${url}`);
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 0 });
      await page.addScriptTag({ content: axeSource });
      const axeResults = await page.evaluate(async () => {
        return await axe.run(document, {
          runOnly: ['wcag2a', 'wcag2aa']
        });
      });
      results.push({ url, violations: axeResults.violations });
    } catch (e) {
      console.error(`⚠️ Error scanning ${url}:`, e.message);
    }
  }

  await browser.close();
  await writeReport(results, 'results');
})();
