const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'categories_to_scrape.json');
const outputPath = path.join(__dirname, 'resolved_brands.json');

(async () => {
  let browser;
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Load existing progress if available
    let resolvedBrands = [];
    if (fs.existsSync(outputPath)) {
      try {
        resolvedBrands = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        console.log(`Loaded ${resolvedBrands.length} already resolved brands.`);
      } catch (e) {
        console.log('Error reading existing output, starting fresh.');
      }
    }
    
    // Create map for easy check
    const resolvedMap = new Map();
    resolvedBrands.forEach(b => {
      resolvedMap.set(`${b.category_id}:${b.brand_name}`, b.resolved_url);
    });

    console.log('Connecting to browser via CDP...');
    browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0];
    let page = context.pages().find(p => p.url().includes('myfranchise.kr'));
    if (!page) {
      page = await context.newPage();
    }

    // Process all brands
    for (const cat of config.categories) {
      console.log(`\n========================================`);
      console.log(`Category: ${cat.category_name} (${cat.category_id})`);
      console.log(`========================================`);
      
      for (const brand of cat.brands) {
        const key = `${cat.category_id}:${brand}`;
        if (resolvedMap.has(key)) {
          console.log(`  - Brand [${brand}] already resolved: ${resolvedMap.get(key)}`);
          continue;
        }

        console.log(`  - Resolving Brand [${brand}]...`);
        const searchUrl = `https://myfranchise.kr/search?page=1&keyword=${encodeURIComponent(brand)}`;
        
        try {
          await page.goto(searchUrl, { waitUntil: 'load', timeout: 30000 });
          await page.waitForTimeout(4000); // Wait for list to load
          
          // Find matching button in search list and click
          const clickResult = await page.evaluate((bName) => {
            const buttons = Array.from(document.querySelectorAll('button'));
            // Remove spaces for comparison
            const targetBName = bName.replace(/\s+/g, '').toLowerCase();
            
            // Find a button containing brand name and store/cost indicators
            const match = buttons.find(b => {
              const text = (b.innerText || '').replace(/\s+/g, '').toLowerCase();
              return text.includes(targetBName) && (text.includes('창업비용') || text.includes('개') || text.includes('평균매출액'));
            });
            
            if (match) {
              match.click();
              return { success: true, text: match.innerText };
            }
            return { success: false };
          }, brand);
          
          if (clickResult.success) {
            console.log(`    - Clicked brand card: "${clickResult.text.replace(/\n/g, ' ')}"`);
            await page.waitForTimeout(4000); // Wait for navigation
            const finalUrl = page.url();
            
            if (finalUrl.includes('myfranchise.kr/') && !finalUrl.includes('/search')) {
              console.log(`    - Resolved URL: ${finalUrl}`);
              resolvedBrands.push({
                category_id: cat.category_id,
                category_name: cat.category_name,
                brand_name: brand,
                resolved_url: finalUrl
              });
              resolvedMap.set(key, finalUrl);
              // Save progress
              fs.writeFileSync(outputPath, JSON.stringify(resolvedBrands, null, 2), 'utf8');
            } else {
              console.warn(`    - Clicked but URL did not navigate to brand detail page. Current URL: ${finalUrl}`);
              // Fallback: use search URL itself or mark as failed
              resolvedBrands.push({
                category_id: cat.category_id,
                category_name: cat.category_name,
                brand_name: brand,
                resolved_url: null,
                notes: 'Navigation failed'
              });
              fs.writeFileSync(outputPath, JSON.stringify(resolvedBrands, null, 2), 'utf8');
            }
          } else {
            console.warn(`    - Could not find matching brand card in search results.`);
            resolvedBrands.push({
              category_id: cat.category_id,
              category_name: cat.category_name,
              brand_name: brand,
              resolved_url: null,
              notes: 'Brand card not found'
            });
            fs.writeFileSync(outputPath, JSON.stringify(resolvedBrands, null, 2), 'utf8');
          }
        } catch (err) {
          console.error(`    - Error resolving brand [${brand}]:`, err.message);
        }
      }
    }

    console.log('\nAll URLs resolved successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Fatal Error:', err);
    process.exit(1);
  }
})();
