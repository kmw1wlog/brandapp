const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const resolvedPath = path.join(__dirname, 'resolved_brands.json');
const outputPath = path.join(__dirname, 'collected_categories_data.json');

function cleanText(text) {
  return text ? text.replace(/\s+/g, ' ').trim() : '';
}

function parseNumber(text) {
  if (!text) return null;
  let clean = text.replace(/,/g, '').trim();
  
  if (clean.includes('면제') || clean.includes('0원') || clean === '-') return 0;
  
  let val = 0;
  
  let eokMatch = clean.match(/(\d+)\s*억/);
  if (eokMatch) {
    val += parseInt(eokMatch[1]) * 100000000;
    clean = clean.replace(/.*억/, '');
  }
  
  let cheonMatch = clean.match(/(\d+)\s*천/);
  if (cheonMatch) {
    val += parseInt(cheonMatch[1]) * 10000000;
    clean = clean.replace(/.*천/, '');
  }
  
  let manMatch = clean.match(/(\d+)\s*만/);
  if (manMatch) {
    val += parseInt(manMatch[1]) * 10000;
    clean = clean.replace(/.*만/, '');
  }
  
  if (val === 0) {
    let numMatch = clean.match(/\d+/);
    if (numMatch) {
      val = parseInt(numMatch[0]);
    }
  }
  
  return val;
}

function parseExpectedCostRange(text) {
  if (!text) return { min: null, max: null };
  const parts = text.split('~');
  if (parts.length === 2) {
    return {
      min: parseNumber(parts[0]),
      max: parseNumber(parts[1])
    };
  }
  const minVal = parseNumber(text);
  return { min: minVal, max: minVal };
}

function extractFranchiseData(brandName, categoryId, categoryName, url, tab1Text, tab2Text) {
  const linesTab1 = tab1Text.split('\n').map(l => l.trim()).filter(l => l);
  const linesTab2 = tab2Text.split('\n').map(l => l.trim()).filter(l => l);

  const getNextLine = (lines, target) => {
    const idx = lines.findIndex(l => l.includes(target));
    if (idx !== -1 && idx + 1 < lines.length) {
      return lines[idx + 1];
    }
    return '';
  };

  const rawSales = getNextLine(linesTab1, '월평균 매출');
  const mainMenu = getNextLine(linesTab1, '주요 메뉴');
  const storeCountStr = getNextLine(linesTab1, '매장');
  const benefitsStr = getNextLine(linesTab1, '창업 혜택');

  const menus = [];
  const menuIdx = linesTab1.findIndex(l => l === '대표 메뉴');
  if (menuIdx !== -1) {
    for (let i = menuIdx + 1; i < linesTab1.length; i += 2) {
      if (i + 1 < linesTab1.length) {
        const menuName = linesTab1[i];
        const menuPrice = linesTab1[i+1];
        if (menuPrice.includes('원') && !menuName.includes('인테리어') && !menuName.includes('홍보 영상')) {
          menus.push({ menu_name: menuName, price: menuPrice });
        } else {
          break;
        }
      }
    }
  }

  let costRangeText = '';
  const costIdx = linesTab1.findIndex(l => l.includes('예상 창업 비용'));
  if (costIdx !== -1) {
    for (let i = costIdx + 1; i < Math.min(costIdx + 6, linesTab1.length); i++) {
      if (linesTab1[i].includes('~')) {
        costRangeText = linesTab1[i];
        break;
      }
    }
  }
  const costRange = parseExpectedCostRange(costRangeText);

  const startupCostTab1 = {
    total_range: costRangeText,
    min: costRange.min,
    max: costRange.max,
    franchise_fee: getNextLine(linesTab1, '가맹비(가입비)'),
    education_fee: getNextLine(linesTab1, '교육비'),
    deposit: getNextLine(linesTab1, '계약 이행 보증금'),
    interior: getNextLine(linesTab1, '실내 공사·인테리어'),
    signboard: getNextLine(linesTab1, '간판·사인'),
    equipment: getNextLine(linesTab1, '주방 설비·집기'),
    initial_goods: getNextLine(linesTab1, '초도비용'),
    other: getNextLine(linesTab1, '별도 공사 비용'),
    rent_deposit: getNextLine(linesTab1, '임대 보증금')
  };

  const disclosureSales = getNextLine(linesTab2, '월평균 매출액');
  const disclosureDate = linesTab2.find(l => l.includes('정보공개서') && (l.includes('202') || l.includes('201')));
  
  let activeStores = null, directStores = null;
  const storeLine1 = linesTab2.find(l => l.includes('가맹점') && /\d+/.test(l));
  const storeLine2 = linesTab2.find(l => l.includes('직영점') && /\d+/.test(l));
  if (storeLine1) activeStores = parseInt(storeLine1.replace(/[^\d]/g, '')) || null;
  if (storeLine2) directStores = parseInt(storeLine2.replace(/[^\d]/g, '')) || 0;

  let newStoresCount = null, closedStoresCount = null, transferCount = null;
  const newStoresLine = linesTab2.find(l => l.startsWith('개점') && /\d+/.test(l));
  const transferLine = linesTab2.find(l => l.startsWith('명의변경') && /\d+/.test(l));
  const closedStoresLine = linesTab2.find(l => l.startsWith('폐점') && /\d+/.test(l));
  if (newStoresLine) newStoresCount = parseInt(newStoresLine.replace(/[^\d]/g, '')) || null;
  if (transferLine) transferCount = parseInt(transferLine.replace(/[^\d]/g, '')) || null;
  if (closedStoresLine) closedStoresCount = parseInt(closedStoresLine.replace(/[^\d]/g, '')) || null;

  let discTotal = null, discFranchise = null, discEducation = null, discDeposit = null, discInterior = null, discInteriorSize = null, discOther = null;
  const discCostIdx = linesTab2.findIndex(l => l === '창업 비용');
  if (discCostIdx !== -1) {
    discTotal = getNextLine(linesTab2, '전체');
    discFranchise = getNextLine(linesTab2, '가맹비');
    discEducation = getNextLine(linesTab2, '교육비');
    discDeposit = getNextLine(linesTab2, '보증금');
    discOther = getNextLine(linesTab2, '기타');
    
    const intIdx = linesTab2.indexOf('인테리어');
    if (intIdx !== -1 && intIdx + 2 < linesTab2.length) {
      discInteriorSize = linesTab2[intIdx + 1];
      discInterior = linesTab2[intIdx + 2];
    }
  }

  let companyName = '', businessStartDate = '', representative = '', companyAddress = '';
  const companyIdx = linesTab2.findIndex(l => l === '본사 정보');
  if (companyIdx !== -1 && companyIdx + 1 < linesTab2.length) {
    companyName = linesTab2[companyIdx + 1];
    const detailsLine = linesTab2.find(l => l.includes('사업개시일'));
    if (detailsLine) {
      const matchStart = detailsLine.match(/사업개시일\s*([\d\.]+)/);
      if (matchStart) businessStartDate = matchStart[1];
      const matchRep = detailsLine.match(/대표\s*(.+)/);
      if (matchRep) representative = matchRep[1].trim();
    }
    const addressLine = linesTab2.find(l => l.includes('우 :') || l.includes('우강M타워') || l.includes('대구광역시') || l.includes('서울시') || l.includes('경기도'));
    if (addressLine) companyAddress = addressLine;
  }

  const disclosureUpdate = getNextLine(linesTab2, '정보공개서 업데이트');

  return {
    brand_name: brandName,
    category_id: categoryId,
    category_name: categoryName,
    source_url: url,
    overview: {
      monthly_average_sales_str: rawSales,
      monthly_average_sales_num: parseNumber(rawSales),
      main_menu: mainMenu,
      store_count_str: storeCountStr,
      store_count_num: parseNumber(storeCountStr),
      benefits_str: benefitsStr,
      benefits_num: parseNumber(benefitsStr)
    },
    representative_menu: menus,
    startup_cost_detailed: {
      total_min: startupCostTab1.min,
      total_max: startupCostTab1.max,
      franchise_fee_str: startupCostTab1.franchise_fee,
      franchise_fee_num: parseNumber(startupCostTab1.franchise_fee),
      education_fee_str: startupCostTab1.education_fee,
      education_fee_num: parseNumber(startupCostTab1.education_fee),
      security_deposit_str: startupCostTab1.deposit,
      security_deposit_num: parseNumber(startupCostTab1.deposit),
      interior_cost_str: startupCostTab1.interior,
      interior_cost_num: parseNumber(startupCostTab1.interior),
      signboard_cost_str: startupCostTab1.signboard,
      signboard_cost_num: parseNumber(startupCostTab1.signboard),
      kitchen_equipment_cost_str: startupCostTab1.equipment,
      kitchen_equipment_cost_num: parseNumber(startupCostTab1.equipment),
      initial_goods_cost_str: startupCostTab1.initial_goods,
      initial_goods_cost_num: parseNumber(startupCostTab1.initial_goods),
      other_cost_str: startupCostTab1.other,
      other_cost_num: parseNumber(startupCostTab1.other),
      rent_deposit_str: startupCostTab1.rent_deposit
    },
    franchise_disclosure: {
      monthly_average_sales_str: disclosureSales,
      monthly_average_sales_num: parseNumber(disclosureSales),
      disclosure_reference: disclosureDate,
      active_stores: activeStores,
      direct_stores: directStores,
      yearly_openings: newStoresCount,
      yearly_closings: closedStoresCount,
      yearly_transfers: transferCount,
      startup_cost_total: parseNumber(discTotal),
      startup_cost_franchise: parseNumber(discFranchise),
      startup_cost_education: parseNumber(discEducation),
      startup_cost_deposit: parseNumber(discDeposit),
      startup_cost_interior: parseNumber(discInterior),
      startup_cost_interior_size: discInteriorSize,
      startup_cost_other: parseNumber(discOther)
    },
    headquarters: {
      company_name: companyName,
      business_start_date: businessStartDate,
      representative: representative,
      address: companyAddress,
      disclosure_update_date: disclosureUpdate
    }
  };
}

(async () => {
  console.log('Starting Detailed Scraper Pipeline...');
  
  let collectedData = [];
  if (fs.existsSync(outputPath)) {
    try {
      collectedData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`Loaded ${collectedData.length} existing records from collected_categories_data.json.`);
    } catch (e) {
      console.warn('Error reading collected_categories_data.json, starting fresh:', e.message);
    }
  }

  const scrapedMap = new Map(collectedData.map(d => [d.brand_name, d]));
  const resolvedBrands = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  
  console.log('Connecting to browser via CDP...');
  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0];
    const page = context.pages().find(p => p.url().includes('myfranchise.kr')) || await context.newPage();
    
    for (let i = 0; i < resolvedBrands.length; i++) {
      const brand = resolvedBrands[i];
      if (scrapedMap.has(brand.brand_name) && !scrapedMap.get(brand.brand_name).error) {
        console.log(`[${i+1}/${resolvedBrands.length}] Skipping already scraped brand: ${brand.brand_name}`);
        continue;
      }

      console.log(`\n========================================`);
      console.log(`[${i+1}/${resolvedBrands.length}] Scraping: ${brand.brand_name} (${brand.category_name})`);
      console.log(`URL: ${brand.resolved_url}`);
      
      try {
        await page.goto(brand.resolved_url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(4000);
        
        const tab1Text = await page.innerText('body');
        
        let tab2Text = '';
        console.log('Switching to "가맹사업 현황" tab...');
        const tab2Selector = page.locator('text="가맹사업 현황"').first();
        try {
          await tab2Selector.click({ timeout: 5000 });
          await page.waitForTimeout(3000);
          tab2Text = await page.innerText('body');
        } catch (errClick) {
          console.warn(`Could not load tab 2: ${errClick.message}. Continuing with tab 1 content only.`);
        }

        const data = extractFranchiseData(brand.brand_name, brand.category_id, brand.category_name, brand.resolved_url, tab1Text, tab2Text);
        
        // Remove existing record if it had error
        collectedData = collectedData.filter(d => d.brand_name !== brand.brand_name);
        collectedData.push(data);
        fs.writeFileSync(outputPath, JSON.stringify(collectedData, null, 2), 'utf8');
        scrapedMap.set(brand.brand_name, data);
        
        console.log(`Successfully scraped details for: ${brand.brand_name}`);
        console.log(`  - Active stores count: ${data.franchise_disclosure.active_stores || 'N/A'}`);
      } catch (errLoop) {
        console.error(`Error scraping ${brand.brand_name}:`, errLoop.message);
        
        const errorRecord = {
          brand_name: brand.brand_name,
          category_id: brand.category_id,
          category_name: brand.category_name,
          source_url: brand.resolved_url,
          error: errLoop.message
        };
        
        collectedData = collectedData.filter(d => d.brand_name !== brand.brand_name);
        collectedData.push(errorRecord);
        fs.writeFileSync(outputPath, JSON.stringify(collectedData, null, 2), 'utf8');
        scrapedMap.set(brand.brand_name, errorRecord);
      }
    }
    
    console.log('\n========================================');
    console.log('Scraper finished processing all brands.');
    process.exit(0);
  } catch (errGlobal) {
    console.error('Fatal Scraper Error:', errGlobal);
    process.exit(1);
  }
})();
