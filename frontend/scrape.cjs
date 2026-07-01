const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36');
  
  try {
    await page.goto('https://www.airbnb.com/rooms/1057404415842813133', {waitUntil: 'networkidle2'});
    await new Promise(r => setTimeout(r, 3000));
    
    const svgs = await page.evaluate(() => {
      const getSvg = (text) => {
        const els = Array.from(document.querySelectorAll('h2, h3, h4, span, div'));
        const el = els.find(e => e.textContent && e.textContent.includes(text));
        if (!el) return null;
        const section = el.closest('section') || el.parentElement.parentElement;
        if (!section) return null;
        const svg = section.querySelector('svg');
        return svg ? svg.outerHTML : null;
      };
      return {
        cancellation: getSvg("Cancellation policy"),
        house: getSvg("House rules"),
        safety: getSvg("Safety & property")
      };
    });
    
    fs.writeFileSync('svgs.json', JSON.stringify(svgs, null, 2));
    console.log('Success extracting SVGs');
  } catch (err) {
    console.log('Error:', err);
  } finally {
    await browser.close();
  }
})();
