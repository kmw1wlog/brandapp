const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0];
    const pages = context.pages();
    const page = pages.find(p => p.url().includes('myfranchise.kr'));
    if (!page) {
      console.log('No myfranchise page found.');
      await browser.close();
      return;
    }
    
    console.log('Page Title:', await page.title());
    console.log('Page URL:', page.url());
    
    const text = await page.innerText('body');
    console.log('--- Body Text (First 1000 chars) ---');
    console.log(text.substring(0, 1000));
    console.log('------------------------------------');
    
    await browser.close();
  } catch (err) {
    console.error('Error:', err);
  }
})();
