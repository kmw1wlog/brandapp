const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const resolvedPath = path.join(__dirname, 'resolved_brands.json');

const searchTerms = {
  '놀부부대찌개': '놀부부대찌개',
  '반올림피자샵': '반올림피자',
  '역전할머니맥주': '역전할머니',
  '한신포차': '한신포차',
  '투다리': '투다리',
  '공차': '공차',
  '아마스빈': '아마스빈',
  '팔공티': '팔공티',
  '쥬씨': '쥬씨'
};

(async () => {
  try {
    const resolvedBrands = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    
    console.log('Connecting to browser...');
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0];
    const page = context.pages().find(p => p.url().includes('myfranchise.kr')) || await context.newPage();
    
    for (let i = 0; i < resolvedBrands.length; i++) {
      const brand = resolvedBrands[i];
      if (brand.resolved_url !== null) continue;
      
      const bName = brand.brand_name;
      const searchTerm = searchTerms[bName] || bName;
      console.log(`Re-resolving Brand [${bName}] (Search: "${searchTerm}")...`);
      
      const searchUrl = `https://myfranchise.kr/search?page=1&keyword=${encodeURIComponent(searchTerm)}`;
      await page.goto(searchUrl, { waitUntil: 'load' });
      await page.waitForTimeout(4000);
      
      const clickResult = await page.evaluate((targetName) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const cleanTarget = targetName.replace(/\s+/g, '').toLowerCase();
        
        // Priority 1: Card containing cost/store details
        let match = buttons.find(b => {
          const text = (b.innerText || '').replace(/\s+/g, '').toLowerCase();
          return text.includes(cleanTarget) && (text.includes('창업비용') || text.includes('개') || text.includes('평균매출액'));
        });
        
        // Priority 2: Simple button
        if (!match) {
          match = buttons.find(b => {
            const text = (b.innerText || '').replace(/\s+/g, '').toLowerCase();
            return text === cleanTarget || text.includes(cleanTarget);
          });
        }
        
        if (match) {
          match.click();
          return { success: true, text: match.innerText };
        }
        return { success: false };
      }, searchTerm);
      
      if (clickResult.success) {
        console.log(`  - Clicked card/button: "${clickResult.text.replace(/\n/g, ' ')}"`);
        await page.waitForTimeout(4000);
        const finalUrl = page.url();
        if (finalUrl.includes('myfranchise.kr/') && !finalUrl.includes('/search')) {
          console.log(`  - Resolved URL: ${finalUrl}`);
          brand.resolved_url = finalUrl;
          if (brand.notes) delete brand.notes;
          fs.writeFileSync(resolvedPath, JSON.stringify(resolvedBrands, null, 2), 'utf8');
        } else {
          console.warn(`  - Did not navigate. URL: ${finalUrl}`);
        }
      } else {
        console.warn(`  - Match not found on search page.`);
      }
    }
    
    console.log('Finished resolving failed brands.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
