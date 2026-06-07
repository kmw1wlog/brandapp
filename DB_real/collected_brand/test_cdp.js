const { chromium } = require('playwright');

(async () => {
  try {
    console.log('Connecting to Chrome on port 9222...');
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log('Connected!');
    
    const contexts = browser.contexts();
    console.log(`Found ${contexts.length} contexts.`);
    
    const context = contexts[0];
    const pages = context.pages();
    console.log(`Found ${pages.length} pages.`);
    
    for (const page of pages) {
      console.log(`- Page: ${await page.title()} (${page.url()})`);
    }
    
    await browser.close();
  } catch (err) {
    console.error('Error connecting to CDP:', err);
  }
})();
