const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0];
    const pages = context.pages();
    let page = pages.find(p => p.url().includes('myfranchise.kr'));
    if (!page) {
      page = await context.newPage();
    }
    
    console.log('Navigating to deopdeopbap...');
    await page.goto('https://myfranchise.kr/20200807/%EB%8D%AE%EB%8D%AE%EB%B0%A5', { waitUntil: 'load' });
    await page.waitForTimeout(3000); // Wait extra time to ensure everything is rendered
    
    console.log('Page Title:', await page.title());
    console.log('Page URL:', page.url());
    
    const text = await page.innerText('body');
    console.log('--- Body Text (First 1000 chars) ---');
    console.log(text.substring(0, 1000));
    console.log('------------------------------------');
    
    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
})();
