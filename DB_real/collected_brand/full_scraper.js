const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const urls = [
  // 고기덮밥 (Meat Rice Bowl - Essential)
  { name: '덮덮밥', url: 'https://myfranchise.kr/20200807/%EB%8D%AE%EB%8D%AE%EB%B0%A5', category: '고기덮밥' },
  { name: '핵밥', url: 'https://myfranchise.kr/20200463/%ED%95%B5%EB%B0%A5', category: '고기덮밥' },
  { name: '덮밥장사장', url: 'https://myfranchise.kr/20210655/%EB%8D%AE%EB%B0%A5%EC%9E%A5%EC%82%AC%EC%9E%A5', category: '고기덮밥' },
  { name: '바로덮밥', url: 'https://myfranchise.kr/20213758/%EB%B0%94%EB%A1%9C%EB%8D%AE%EB%B0%A5-%EB%B0%94%EB%A1%9C%ED%8C%8C%EC%8A%A4%ED%83%80-%EA%B2%BD%EC%96%91%EC%8B%9D', category: '고기덮밥' },
  { name: '순수덮밥', url: 'https://myfranchise.kr/20211340/%EC%8A%9C%EC%8A%98%EB%8D%AE%EB%B0%A5', category: '고기덮밥' },
  { name: '덮밥슈퍼', url: 'https://myfranchise.kr/20191261/%EB%8D%AE%EB%B0%A5%EC%8A%88%ED%8D%BC', category: '고기덮밥' },
  { name: '1992덮밥&짜글이', url: 'https://myfranchise.kr/20210513/1992%EB%8D%AE%EB%B0%A5-%EC%A7%9C%EA%B8%80%EC%9D%B4', category: '고기덮밥' },

  // 돈까스 (Pork Cutlet)
  { name: '뜨돈(DD\'DON)', url: 'https://myfranchise.kr/20161129/%EB%9C%A8%EB%8F%88-DD-DON-', category: '돈까스' },
  { name: '진심왕돈까스', url: 'https://myfranchise.kr/20220666/%EC%A7%84%EC%8B%AC%EC%99%95%EB%8F%88%EA%B9%8C%EC%8A%A4', category: '돈까스' },
  { name: '엠브로돈까스', url: 'https://myfranchise.kr/20212382/%EC%97%A0%EB%B8%8C%EB%A1%9C%EB%8F%88%EA%B9%8C%EC%8A%A4', category: '돈까스' },
  { name: '무공돈까스', url: 'https://myfranchise.kr/brand/%EB%AC%B4%EA%B3%B5%EB%8F%88%EA%B9%8C%EC%8A%A4', category: '돈까스' },
  { name: '백소정', url: 'https://myfranchise.kr/brand/%EB%B0%B1%EC%86%8C%EC%A0%95', category: '돈까스' },

  // 삼겹살/고깃집 (Pork belly / Grilled Meat)
  { name: '동래정 백탄직화', url: 'https://myfranchise.kr/20220525/%EB%8F%99%EB%9E%98%EC%A0%95-%EB%B0%B1%ED%83%84%EC%A7%81%ED%99%94', category: '삼겹살' },
  { name: '육칠이', url: 'https://myfranchise.kr/20213078/%EC%9C%A1%EC%B9%A0%EC%9D%B4', category: '삼겹살' },
  { name: '푸줏간 고기도시락', url: 'https://myfranchise.kr/20201685/%ED%91%B8%EC%A4%8F%EA%B0%84-%EA%B3%A0%EA%B8%B0%EB%8F%84%EC%8B%9C%EB%9D%BD', category: '삼겹살' },
  { name: '고기극찬', url: 'https://myfranchise.kr/20201014/%EA%B3%A0%EA%B8%B0%EA%B7%B9%EC%B0%AC', category: '삼겹살' },
  { name: '하남돼지집', url: 'https://myfranchise.kr/brand/%ED%95%98%EB%82%A8%EB%8F%BC%EC%A7%85', category: '삼겹살' },
  { name: '이차돌', url: 'https://myfranchise.kr/brand/%EC%9D%B4%EC%B0%A8%EB%8F%8C', category: '삼겹살' }
];

function cleanText(text) {
  return text ? text.replace(/\s+/g, ' ').trim() : '';
}

function parseNumber(text) {
  if (!text) return null;
  let clean = text.replace(/,/g, '').trim();
  
  // check for "면제" or "할인" or "0원"
  if (clean.includes('면제') || clean.includes('0원') || clean === '-') return 0;
  
  let val = 0;
  
  // Parse '억'
  let eokMatch = clean.match(/(\d+)\s*억/);
  if (eokMatch) {
    val += parseInt(eokMatch[1]) * 100000000;
    clean = clean.replace(/.*억/, '');
  }
  
  // Parse '천'
  let cheonMatch = clean.match(/(\d+)\s*천/);
  if (cheonMatch) {
    val += parseInt(cheonMatch[1]) * 10000000;
    clean = clean.replace(/.*천/, '');
  }
  
  // Parse '만'
  let manMatch = clean.match(/(\d+)\s*만/);
  if (manMatch) {
    val += parseInt(manMatch[1]) * 10000;
    clean = clean.replace(/.*만/, '');
  }
  
  // Fallback if no units matched but numbers exist
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

function extractFranchiseData(brandName, category, url, tab1Text, tab2Text) {
  const linesTab1 = tab1Text.split('\n').map(l => l.trim()).filter(l => l);
  const linesTab2 = tab2Text.split('\n').map(l => l.trim()).filter(l => l);

  const getNextLine = (lines, target) => {
    const idx = lines.findIndex(l => l.includes(target));
    if (idx !== -1 && idx + 1 < lines.length) {
      return lines[idx + 1];
    }
    return '';
  };

  // --- Parse Tab 1 (브랜드 정보) ---
  const rawSales = getNextLine(linesTab1, '월평균 매출');
  const mainMenu = getNextLine(linesTab1, '주요 메뉴');
  const storeCountStr = getNextLine(linesTab1, '매장');
  const benefitsStr = getNextLine(linesTab1, '창업 혜택');

  // Representative Menu
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

  // Startup Cost Range
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

  // Tab 1 cost details
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

  // --- Parse Tab 2 (가맹사업 현황) ---
  const disclosureSales = getNextLine(linesTab2, '월평균 매출액');
  const disclosureDate = linesTab2.find(l => l.includes('정보공개서') && (l.includes('202') || l.includes('201')));
  
  // Store status
  let activeStores = null, directStores = null;
  const storeLine1 = linesTab2.find(l => l.includes('가맹점') && /\d+/.test(l));
  const storeLine2 = linesTab2.find(l => l.includes('직영점') && /\d+/.test(l));
  if (storeLine1) activeStores = parseInt(storeLine1.replace(/[^\d]/g, '')) || null;
  if (storeLine2) directStores = parseInt(storeLine2.replace(/[^\d]/g, '')) || 0;

  // Opening / Closing trends
  let newStoresCount = null, closedStoresCount = null, transferCount = null;
  const newStoresLine = linesTab2.find(l => l.startsWith('개점') && /\d+/.test(l));
  const transferLine = linesTab2.find(l => l.startsWith('명의변경') && /\d+/.test(l));
  const closedStoresLine = linesTab2.find(l => l.startsWith('폐점') && /\d+/.test(l));
  if (newStoresLine) newStoresCount = parseInt(newStoresLine.replace(/[^\d]/g, '')) || null;
  if (transferLine) transferCount = parseInt(transferLine.replace(/[^\d]/g, '')) || null;
  if (closedStoresLine) closedStoresCount = parseInt(closedStoresLine.replace(/[^\d]/g, '')) || null;

  // Disclosure Costs
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

  // Headquarters Info
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
    const addressLine = linesTab2.find(l => l.includes('우 :') || l.includes('우강M타워') || l.includes('대구광역시') || l.includes('서울시'));
    if (addressLine) companyAddress = addressLine;
  }

  const disclosureUpdate = getNextLine(linesTab2, '정보공개서 업데이트');

  return {
    brand_name: brandName,
    category: category,
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
  console.log('Starting Scraper Pipeline...');
  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0];
    const pages = context.pages();
    let page = pages.find(p => p.url().includes('myfranchise.kr'));
    if (!page) {
      page = await context.newPage();
    }

    const results = [];

    for (const item of urls) {
      console.log(`\n========================================`);
      console.log(`Scraping Brand [${item.name}] (${item.category})...`);
      try {
        // Step 1: Navigating to tab 1
        console.log(`Navigating to: ${item.url}`);
        await page.goto(item.url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(4000); // Allow React to mount and load session details
        
        const tab1Text = await page.innerText('body');
        
        // Step 2: Navigate to tab 2 (가맹사업 현황)
        console.log(`Clicking "가맹사업 현황" tab...`);
        const tab2Selector = page.locator('text="가맹사업 현황"').first();
        
        let tab2Text = '';
        try {
          await tab2Selector.click({ timeout: 5000 });
          await page.waitForTimeout(3000);
          tab2Text = await page.innerText('body');
        } catch (errClick) {
          console.warn(`WARNING: Could not click tab 2 for ${item.name}: ${errClick.message}. Trying to reload page and extract tab 1 data only.`);
        }

        // Parse extracted data
        const data = extractFranchiseData(item.name, item.category, item.url, tab1Text, tab2Text);
        results.push(data);
        console.log(`Scraped successfully: ${item.name}`);
        console.log(`  - Monthly Average Sales: ${data.overview.monthly_average_sales_str || 'N/A'}`);
        console.log(`  - Active Stores Count: ${data.franchise_disclosure.active_stores || 'N/A'}`);
      } catch (errLoop) {
        console.error(`ERROR scraping brand ${item.name}:`, errLoop);
        // Push raw metadata in case of failure
        results.push({
          brand_name: item.name,
          category: item.category,
          source_url: item.url,
          error: errLoop.message
        });
      }
    }

    // Save outputs
    const outDir = '/home/openq/.gemini/antigravity/brain/5a635bd9-a1f3-4802-a540-792060439ada/artifacts';
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outFile = path.join(outDir, 'collected_brand_data.json');
    fs.writeFileSync(outFile, JSON.stringify(results, null, 2), 'utf8');
    
    console.log(`\n========================================`);
    console.log(`Pipeline Completed! Saved ${results.length} records to ${outFile}`);
    
    await browser.close();
  } catch (errGlobal) {
    console.error('Fatal Pipeline Error:', errGlobal);
  }
})();
