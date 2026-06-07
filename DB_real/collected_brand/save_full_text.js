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
    }
    
    await page.goto('https://myfranchise.kr/20200807/%EB%8D%AE%EB%8D%AE%EB%B0%A5', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    
    // Tab 1: 브랜드 정보
    const tab1Text = await page.innerText('body');
    fs.writeFileSync('/home/openq/.gemini/antigravity/brain/5a635bd9-a1f3-4802-a540-792060439ada/scratch/tab1_brand_info.txt', tab1Text, 'utf8');
    
    // Click Tab 2
    await page.locator('text="가맹사업 현황"').first().click();
    await page.waitForTimeout(3000);
    const tab2Text = await page.innerText('body');
    fs.writeFileSync('/home/openq/.gemini/antigravity/brain/5a635bd9-a1f3-4802-a540-792060439ada/scratch/tab2_franchise_status.txt', tab2Text, 'utf8');
    
    console.log('Saved both files.');
    await browser.close();
  } catch (err) {
    console.error('Error:', err);
  }
})();
