const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0];
    const pages = context.pages();
    let page = pages.find(p => p.url().includes('myfranchise.kr'));
    if (!page) {
      page = await context.newPage();
      await page.goto('https://myfranchise.kr/20200807/%EB%8D%AE%EB%8D%AE%EB%B0%A5');
    }
    
    // Make sure we wait for content
    await page.waitForTimeout(3000);
    
    const bodyHTML = await page.innerHTML('body');
    fs.writeFileSync('/home/openq/.gemini/antigravity/brain/5a635bd9-a1f3-4802-a540-792060439ada/scratch/deopdeopbap_body.html', bodyHTML, 'utf8');
    console.log('HTML saved successfully.');
    
    await browser.close();
  } catch (err) {
    console.error('Error:', err);
  }
})();
