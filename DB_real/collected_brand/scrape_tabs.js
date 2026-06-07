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
    
    console.log('Navigating...');
    await page.goto('https://myfranchise.kr/20200807/%EB%8D%AE%EB%8D%AE%EB%B0%A5', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    
    console.log('--- Brand Info Tab Text ---');
    let brandInfoText = await page.innerText('body');
    console.log(brandInfoText.substring(0, 1000));
    
    console.log('\nClicking "가맹사업 현황" tab...');
    await page.locator('text="가맹사업 현황"').first().click();
    await page.waitForTimeout(2000);
    
    console.log('--- 가맹사업 현황 Tab Text (First 1500 chars) ---');
    let franchiseText = await page.innerText('body');
    console.log(franchiseText.substring(0, 1500));
    
    await browser.close();
  } catch (err) {
    console.error('Error:', err);
  }
})();
