const { URL } = require('url');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function crawlSite(startUrl, maxPages = 50) {
  const visited = new Set();
  const toVisit = [startUrl];
  const origin = new URL(startUrl).origin;

  while (toVisit.length > 0 && visited.size < maxPages) {
    const currentUrl = toVisit.shift();
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    try {
      const res = await fetch(currentUrl);
      if (!res.ok || !res.headers.get('content-type')?.includes('text/html')) continue;

      const html = await res.text();
      const $ = cheerio.load(html);
      $('a[href]').each((_, el) => {
        let href = $(el).attr('href');
        if (!href) return;
        try {
          const absUrl = new URL(href, currentUrl);
          if (absUrl.origin === origin && !visited.has(absUrl.href)) {
            toVisit.push(absUrl.href);
          }
        } catch (e) {}
      });
    } catch (e) {
      console.warn(`Skipping ${currentUrl}: ${e.message}`);
    }
  }

  return [...visited];
}

module.exports = { crawlSite };
