import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outRoot = path.join(root, "DB_real/experience_db");
const imagePublicRoot = "/branch/image_template/categories";
const latestYear = 2025;

const categoryMaster = [
  {
    category_id: "rice_bowl",
    display_name: "덮밥",
    aliases: ["고기덮밥", "덮밥", "일식 카레/돈가스/덮밥"],
    sdsc_codes: [{ large: "I2", middle: "I203", small: "I20302", label: "일식 카레/돈가스/덮밥" }],
    ftc_industry_names: ["일식", "한식"],
    representative_menu_groups: ["고기덮밥", "제육덮밥", "가라아게덮밥"],
    delivery_fit: "high",
    turnover: "fast",
    average_ticket_band: [9500, 13000],
    food_cost_rate_band: [0.31, 0.38],
    operation_formats: ["점포+배달 혼합형", "배달형"]
  },
  {
    category_id: "coffee_drink",
    display_name: "커피/버블티/음료",
    aliases: ["커피", "카페", "버블티", "음료"],
    sdsc_codes: [{ large: "I2", middle: "I212", small: "I21201", label: "카페" }],
    ftc_industry_names: ["커피", "음료 (커피 외)"],
    representative_menu_groups: ["커피", "논커피", "버블티"],
    delivery_fit: "medium",
    turnover: "medium",
    average_ticket_band: [4800, 7600],
    food_cost_rate_band: [0.24, 0.34],
    operation_formats: ["점포형", "테이크아웃형"]
  },
  {
    category_id: "dessert_bakery",
    display_name: "디저트/베이커리",
    aliases: ["디저트", "베이커리", "제과제빵", "빵", "빙수"],
    sdsc_codes: [
      { large: "I2", middle: "I210", small: "I21001", label: "빵/도넛" },
      { large: "I2", middle: "I210", small: "I21008", label: "아이스크림/빙수" }
    ],
    ftc_industry_names: ["제과제빵", "아이스크림/빙수 "],
    representative_menu_groups: ["베이커리", "케이크", "빙수"],
    delivery_fit: "medium",
    turnover: "medium",
    average_ticket_band: [6500, 12000],
    food_cost_rate_band: [0.28, 0.39],
    operation_formats: ["점포형", "테이크아웃형"]
  },
  {
    category_id: "korean_food",
    display_name: "한식",
    aliases: ["한식", "백반", "국밥", "찌개"],
    sdsc_codes: [{ large: "I2", middle: "I201", small: "I20199", label: "기타 한식 음식점" }],
    ftc_industry_names: ["한식"],
    representative_menu_groups: ["백반", "국탕찌개", "구이"],
    delivery_fit: "high",
    turnover: "medium",
    average_ticket_band: [9000, 15000],
    food_cost_rate_band: [0.34, 0.43],
    operation_formats: ["점포형", "점포+배달 혼합형"]
  },
  {
    category_id: "chinese_food",
    display_name: "중식",
    aliases: ["중식", "중국집", "마라탕"],
    sdsc_codes: [{ large: "I2", middle: "I202", small: "I20201", label: "중국집" }],
    ftc_industry_names: ["중식"],
    representative_menu_groups: ["면류", "밥류", "마라"],
    delivery_fit: "high",
    turnover: "fast",
    average_ticket_band: [9000, 14000],
    food_cost_rate_band: [0.3, 0.38],
    operation_formats: ["점포+배달 혼합형", "배달형"]
  },
  {
    category_id: "japanese_food",
    display_name: "일식",
    aliases: ["일식", "초밥", "돈가스", "라멘"],
    sdsc_codes: [{ large: "I2", middle: "I203", small: "I20399", label: "기타 일식 음식점" }],
    ftc_industry_names: ["일식"],
    representative_menu_groups: ["라멘", "초밥", "돈가스"],
    delivery_fit: "medium",
    turnover: "medium",
    average_ticket_band: [11000, 19000],
    food_cost_rate_band: [0.33, 0.45],
    operation_formats: ["점포형", "점포+배달 혼합형"]
  },
  {
    category_id: "western_pizza",
    display_name: "양식/피자",
    aliases: ["양식", "피자", "파스타", "스테이크"],
    sdsc_codes: [
      { large: "I2", middle: "I204", small: "I20402", label: "파스타/스테이크" },
      { large: "I2", middle: "I210", small: "I21003", label: "피자" }
    ],
    ftc_industry_names: ["서양식", "피자"],
    representative_menu_groups: ["파스타", "피자", "그릴"],
    delivery_fit: "high",
    turnover: "medium",
    average_ticket_band: [12000, 21000],
    food_cost_rate_band: [0.29, 0.4],
    operation_formats: ["점포형", "점포+배달 혼합형"]
  },
  {
    category_id: "snack_chicken",
    display_name: "분식/치킨",
    aliases: ["분식", "치킨", "김밥", "떡볶이"],
    sdsc_codes: [
      { large: "I2", middle: "I210", small: "I21007", label: "김밥/만두/분식" },
      { large: "I2", middle: "I210", small: "I21006", label: "치킨" }
    ],
    ftc_industry_names: ["분식", "치킨"],
    representative_menu_groups: ["떡볶이", "김밥", "치킨"],
    delivery_fit: "high",
    turnover: "fast",
    average_ticket_band: [7500, 18000],
    food_cost_rate_band: [0.28, 0.39],
    operation_formats: ["점포+배달 혼합형", "배달형"]
  },
  {
    category_id: "burger_sandwich",
    display_name: "버거/샌드위치",
    aliases: ["버거", "샌드위치", "토스트", "샐러드"],
    sdsc_codes: [
      { large: "I2", middle: "I210", small: "I21004", label: "버거" },
      { large: "I2", middle: "I210", small: "I21005", label: "토스트/샌드위치/샐러드" }
    ],
    ftc_industry_names: ["패스트푸드"],
    representative_menu_groups: ["버거", "샌드위치", "토스트"],
    delivery_fit: "high",
    turnover: "fast",
    average_ticket_band: [8500, 14500],
    food_cost_rate_band: [0.3, 0.39],
    operation_formats: ["점포+배달 혼합형", "테이크아웃형"]
  },
  {
    category_id: "lunchbox",
    display_name: "도시락",
    aliases: ["도시락", "밀박스", "정식도시락"],
    sdsc_codes: [{ large: "I2", middle: "I210", small: "I21099", label: "그 외 기타 간이 음식점" }],
    ftc_industry_names: ["기타 외식", "한식"],
    representative_menu_groups: ["한식 도시락", "고기 도시락", "샐러드 도시락"],
    delivery_fit: "high",
    turnover: "fast",
    average_ticket_band: [8500, 13500],
    food_cost_rate_band: [0.33, 0.42],
    operation_formats: ["배달형", "점포+배달 혼합형"]
  },
  {
    category_id: "salad_poke",
    display_name: "샐러드/포케",
    aliases: ["샐러드", "포케", "건강식"],
    sdsc_codes: [{ large: "I2", middle: "I210", small: "I21005", label: "토스트/샌드위치/샐러드" }],
    ftc_industry_names: ["패스트푸드", "기타 외식"],
    representative_menu_groups: ["샐러드", "포케", "그레인볼"],
    delivery_fit: "high",
    turnover: "medium",
    average_ticket_band: [9500, 15500],
    food_cost_rate_band: [0.32, 0.43],
    operation_formats: ["점포+배달 혼합형", "테이크아웃형"]
  }
];

const menuSeeds = {
  rice_bowl: ["우삼겹 덮밥", "제육 덮밥", "불고기 덮밥", "가라아게 덮밥", "치킨마요 덮밥", "스테이크 덮밥", "명란 아보카도 덮밥", "매운 돼지 덮밥", "연어 덮밥", "반반 고기 덮밥"],
  coffee_drink: ["아메리카노", "카페라떼", "바닐라라떼", "콜드브루", "말차라떼", "초코라떼", "흑당 버블티", "타로 버블티", "과일 에이드", "시그니처 크림라떼"],
  dessert_bakery: ["소금빵", "크루아상", "바스크 치즈케이크", "딸기 생크림 케이크", "도넛", "마들렌", "휘낭시에", "빙수", "파운드 케이크", "베이글 샌드"],
  korean_food: ["김치찌개", "된장찌개", "제육볶음", "불고기 정식", "닭갈비", "국밥", "비빔밥", "갈비탕", "순두부찌개", "보쌈 정식"],
  chinese_food: ["짜장면", "짬뽕", "탕수육", "마라탕", "마라샹궈", "볶음밥", "유린기", "깐풍기", "꿔바로우", "중화비빔밥"],
  japanese_food: ["돈가스 정식", "라멘", "가츠동", "규동", "초밥 세트", "우동", "카레라이스", "사케동", "텐동", "모둠 사시미"],
  western_pizza: ["마르게리타 피자", "페퍼로니 피자", "크림 파스타", "토마토 파스타", "스테이크", "리조또", "라자냐", "필라프", "샐러드 파스타", "피자 세트"],
  snack_chicken: ["떡볶이", "김밥", "순대", "튀김", "라볶이", "양념치킨", "후라이드치킨", "닭강정", "치킨버거 세트", "분식 세트"],
  burger_sandwich: ["클래식 버거", "치즈버거", "치킨버거", "불고기버거", "에그 토스트", "클럽 샌드위치", "햄치즈 샌드위치", "BLT 샌드위치", "감자튀김 세트", "아보카도 샌드"],
  lunchbox: ["제육 도시락", "불고기 도시락", "치킨 도시락", "연어 도시락", "돈가스 도시락", "비빔밥 도시락", "닭가슴살 도시락", "삼겹 도시락", "반찬 정식 도시락", "프리미엄 도시락"],
  salad_poke: ["닭가슴살 샐러드", "연어 포케", "참치 포케", "두부 샐러드", "그릴드 치킨 볼", "아보카도 샐러드", "쉬림프 포케", "비건 그레인볼", "스테이크 샐러드", "콥 샐러드"]
};

const namingSeeds = {
  rice_bowl: ["덮온", "한그릇연구소", "고기담다", "볼앤불"],
  coffee_drink: ["브루리프", "컵스테이", "모닝펄", "드링크룸"],
  dessert_bakery: ["버터노트", "스위트랙", "도우하우스", "크림페이지"],
  korean_food: ["밥상결", "오늘한상", "국밥기록", "정갈집"],
  chinese_food: ["웍앤면", "홍등식탁", "마라정류장", "중화연구실"],
  japanese_food: ["돈카츠정원", "라멘온", "스시노트", "카레하루"],
  western_pizza: ["오븐스퀘어", "파스타룸", "피자그라운드", "테이블웨스트"],
  snack_chicken: ["분식정거장", "치킨바스켓", "떡볶이랩", "바삭상회"],
  burger_sandwich: ["번앤브레드", "샌드스테이", "버거노드", "토스트랩"],
  lunchbox: ["도시락편지", "런치큐브", "한끼박스", "밀데이"],
  salad_poke: ["그린볼", "포케그라운드", "샐러드온", "볼앤그레인"]
};

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  const filePath = path.join(outRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function median(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

function average(values) {
  const filtered = values.filter((value) => Number.isFinite(value));
  if (filtered.length === 0) return null;
  return Math.round(filtered.reduce((sum, value) => sum + value, 0) / filtered.length);
}

function percentile(values, p) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

function buildBenchmarks(category, brandRows, industryRows) {
  const rows = brandRows
    .filter((row) => category.ftc_industry_names.includes(row.industryMediumClassName))
    .filter((row) => (row.franchiseStoreCount ?? 0) > 0)
    .filter((row) => (row.averageSalesAmountRaw ?? 0) >= 30_000 && (row.averageSalesAmountRaw ?? 0) <= 5_000_000)
    .sort((a, b) => (b.franchiseStoreCount ?? 0) - (a.franchiseStoreCount ?? 0));
  const startupRows = rows.filter((row) => (row.startupTotalAmountRaw ?? 0) > 0 && (row.startupTotalAmountRaw ?? 0) < 1_500_000);
  const annualSales = rows.map((row) => row.averageSalesAmountRaw * 1000);
  const monthlySales = annualSales.map((value) => Math.round(value / 12));
  const startupCosts = startupRows.map((row) => row.startupTotalAmountRaw * 1000);
  const storeCounts = rows.map((row) => row.franchiseStoreCount ?? 0);
  const openingCounts = rows.map((row) => row.newFranchiseRegistrationCount ?? 0);
  const closureCounts = rows.map((row) => (row.contractEndCount ?? 0) + (row.contractCancellationCount ?? 0));
  const industryStats = industryRows.filter((row) => category.ftc_industry_names.includes(row.industryMediumClassName));

  return {
    category_id: category.category_id,
    source_year: latestYear,
    ftc_industry_names: category.ftc_industry_names,
    sample_size: rows.length,
    startup_sample_size: startupRows.length,
    brand_count_by_industry: Object.fromEntries(category.ftc_industry_names.map((name) => [name, rows.filter((row) => row.industryMediumClassName === name).length])),
    annual_sales_krw: {
      median: median(annualSales),
      average: average(annualSales),
      p25: percentile(annualSales, 0.25),
      p75: percentile(annualSales, 0.75)
    },
    monthly_sales_krw: {
      median: median(monthlySales),
      average: average(monthlySales),
      p25: percentile(monthlySales, 0.25),
      p75: percentile(monthlySales, 0.75)
    },
    startup_cost_krw: {
      median: median(startupCosts),
      average: average(startupCosts),
      p25: percentile(startupCosts, 0.25),
      p75: percentile(startupCosts, 0.75)
    },
    store_count: {
      median: median(storeCounts),
      average: average(storeCounts)
    },
    open_close: {
      average_new_registration_count: average(openingCounts),
      average_closure_like_count: average(closureCounts),
      closure_like_rate_by_store: Number(((closureCounts.reduce((sum, value) => sum + value, 0) || 0) / Math.max(1, storeCounts.reduce((sum, value) => sum + value, 0))).toFixed(4))
    },
    industry_rows: industryStats,
    top_brands: rows.slice(0, 50).map((row, index) => ({
      rank: index + 1,
      brand_id: `${category.category_id}_${index + 1}`,
      brand_name: row.brandName,
      corp_name: row.corpName,
      franchise_store_count: row.franchiseStoreCount,
      average_annual_sales_krw: row.averageSalesAmountRaw * 1000,
      average_monthly_sales_krw: Math.round((row.averageSalesAmountRaw * 1000) / 12),
      area_unit_average_sales_krw: row.areaUnitAverageSalesAmountRaw ? row.areaUnitAverageSalesAmountRaw * 1000 : null,
      startup_cost_krw: row.startupTotalAmountRaw ? row.startupTotalAmountRaw * 1000 : null,
      new_franchise_registration_count: row.newFranchiseRegistrationCount,
      contract_end_count: row.contractEndCount,
      contract_cancellation_count: row.contractCancellationCount,
      source: "공정거래위원회 가맹정보 OpenAPI"
    }))
  };
}

function buildMenuEconomics(category) {
  const [lowTicket, highTicket] = category.average_ticket_band;
  const [lowFoodCost, highFoodCost] = category.food_cost_rate_band;
  return (menuSeeds[category.category_id] ?? []).map((name, index) => {
    const position = index / Math.max(1, menuSeeds[category.category_id].length - 1);
    const priceLow = Math.round((lowTicket + (highTicket - lowTicket) * position * 0.65) / 100) * 100;
    const priceHigh = Math.round((priceLow * (1.18 + position * 0.12)) / 100) * 100;
    const foodLow = Number((lowFoodCost + position * 0.02).toFixed(2));
    const foodHigh = Number((Math.min(highFoodCost, foodLow + 0.06)).toFixed(2));
    return {
      category_id: category.category_id,
      menu_group: category.representative_menu_groups[index % category.representative_menu_groups.length],
      menu_name: name,
      recommended_price_band_krw: [priceLow, priceHigh],
      ingredient_cost_rate_band: [foodLow, foodHigh],
      packaging_cost_krw: category.delivery_fit === "high" ? 450 + (index % 3) * 80 : 250 + (index % 3) * 60,
      delivery_fit: index % 4 === 0 ? "medium" : category.delivery_fit,
      cooking_time_minutes: category.turnover === "fast" ? 5 + (index % 5) * 2 : 8 + (index % 6) * 3,
      margin_rate_band: [Number((1 - foodHigh - 0.16).toFixed(2)), Number((1 - foodLow - 0.11).toFixed(2))],
      labor_difficulty: category.turnover === "fast" ? "medium" : index % 3 === 0 ? "high" : "medium"
    };
  });
}

function buildImageTemplates(category) {
  const dir = path.join(root, "public/branch/image_template/categories", category.category_id);
  const files = fs.readdirSync(dir).filter((file) => /\.(jpg|jpeg|png)$/i.test(file)).sort();
  return files.map((file, index) => ({
    template_id: `${category.category_id}_template_${index + 1}`,
    category_id: category.category_id,
    visual_concept: `${category.display_name} 체험 브랜드 템플릿 ${index + 1}`,
    hero_menu_visual: category.representative_menu_groups[index % category.representative_menu_groups.length],
    signage_style: index % 2 === 0 ? "전면 간판 중심" : "패키지와 매장 사인 통합",
    primary_color: ["deep green", "warm red", "cream black", "fresh blue"][index % 4],
    package_style: category.delivery_fit === "high" ? "배달 패키지 강조" : "테이크아웃 패키지 강조",
    interior_tone: index % 2 === 0 ? "밝은 소형 매장" : "컴팩트한 오픈 주방",
    prompt: `Use this image as a KIE nano banana pro reference template. Create a realistic Korean food-service brand visual for ${category.display_name}, including storefront signage, signature menu, packaging, and menu board. Keep the layout commercially usable and franchise presentation ready.`,
    negative_prompt: "no fake unreadable small text, no distorted logo, no extra hands, no watermark, no low-resolution blur",
    image_path: `${imagePublicRoot}/${category.category_id}/${file}`,
    local_source_path: `image_templat/${category.category_id}/${file}`,
    kie_model: "kie-nano-banana-pro",
    fallbackDuplicate: category.category_id === "salad_poke" && index === 3
  }));
}

function buildSimulationRule(category, benchmark, locationProfile) {
  const ticket = Math.round((category.average_ticket_band[0] + category.average_ticket_band[1]) / 2);
  const monthlySales = benchmark.monthly_sales_krw.median ?? ticket * 75 * 26;
  const baseDailyOrders = Math.max(35, Math.round(monthlySales / ticket / 26));
  const locationCompetition = locationProfile?.metrics?.sameSmallStoreDensityPerKm2 ?? 20;
  return {
    category_id: category.category_id,
    base_average_order_value_krw: ticket,
    base_daily_orders: baseDailyOrders,
    hall_sales_share: category.delivery_fit === "high" ? 0.48 : 0.68,
    delivery_sales_share: category.delivery_fit === "high" ? 0.52 : 0.32,
    food_cost_rate: Number(((category.food_cost_rate_band[0] + category.food_cost_rate_band[1]) / 2).toFixed(2)),
    labor_cost_rate: category.turnover === "fast" ? 0.19 : 0.23,
    proper_rent_ratio: 0.1,
    location_score_weight: 0.36,
    competition_penalty: Number(Math.min(0.18, locationCompetition / 1000).toFixed(3)),
    sns_bonus: 0.04,
    tourism_event_bonus: 0.03,
    ramp_up_curve: [0.62, 0.82, 1, 1.08],
    explanation: "공정위 업종 평균 매출, 소진공 반경 경쟁 밀도, 메뉴 객단가를 합친 체험용 룰엔진"
  };
}

function buildVirtualBrandTemplate(category, benchmark, imageTemplates) {
  const names = namingSeeds[category.category_id] ?? [category.display_name];
  return {
    category_id: category.category_id,
    generated_brand_name_candidates: names.map((name, index) => ({
      name,
      tagline: `${category.display_name}을 ${index % 2 === 0 ? "빠르게 회전시키는" : "지역 상권에 맞춘"} 소형 브랜드`
    })),
    default_brand_name: names[0],
    default_tagline: `${category.display_name} 업종 평균과 입지 지표로 조정한 가상 브랜드`,
    menu_board_template: category.representative_menu_groups.map((group) => `${group} 대표 메뉴 3종`),
    benchmark_reference: {
      source_year: latestYear,
      sample_size: benchmark.sample_size,
      monthly_sales_median_krw: benchmark.monthly_sales_krw.median,
      startup_cost_median_krw: benchmark.startup_cost_krw.median
    },
    template_image_ids: imageTemplates.map((template) => template.template_id)
  };
}

function main() {
  fs.rmSync(outRoot, { recursive: true, force: true });
  const brandRows = readJson("DB_real/ftc_franchise_db/normalized/food_service_brand_joined_latest.json");
  const industryRows = readJson("DB_real/ftc_franchise_db/aggregates/food_service_industry_averages_latest.json");
  const locationProfiles = readJson("DB_real/sbiz_location_db/profiles/location_profile_cache_seed.json");

  const benchmarks = categoryMaster.map((category) => buildBenchmarks(category, brandRows, industryRows));
  const allImageTemplates = categoryMaster.flatMap(buildImageTemplates);
  const allMenus = categoryMaster.flatMap(buildMenuEconomics);
  const simulationRules = categoryMaster.map((category) => {
    const benchmark = benchmarks.find((item) => item.category_id === category.category_id);
    const locationProfile = category.category_id === "coffee_drink" ? locationProfiles.find((profile) => profile.request.category.smallCode === "I21201") : locationProfiles[0];
    return buildSimulationRule(category, benchmark, locationProfile);
  });
  const virtualBrands = categoryMaster.map((category) => {
    const benchmark = benchmarks.find((item) => item.category_id === category.category_id);
    const imageTemplates = allImageTemplates.filter((item) => item.category_id === category.category_id);
    return buildVirtualBrandTemplate(category, benchmark, imageTemplates);
  });

  writeJson("category_master.json", categoryMaster);
  writeJson("brand_benchmarks_by_category.json", benchmarks);
  writeJson("menu_economics.json", allMenus);
  writeJson("image_templates.json", allImageTemplates);
  writeJson("simulation_rules.json", simulationRules);
  writeJson("virtual_brand_templates.json", virtualBrands);
  writeJson("experience_summary.json", {
    generatedAt: new Date().toISOString(),
    categoryCount: categoryMaster.length,
    imageTemplateCount: allImageTemplates.length,
    menuRecordCount: allMenus.length,
    benchmarkCategoryCount: benchmarks.length,
    sources: [
      "DB_real/ftc_franchise_db",
      "DB_real/sbiz_location_db",
      "image_templat"
    ],
    notes: [
      "FTC averageSalesAmountRaw is preserved through the FTC DB; experience simulation uses filtered plausible annual sales bands.",
      "salad_poke_template_4 is a fallback duplicate because only 43 source images were present."
    ]
  });
  console.log(`built experience db -> ${path.relative(root, outRoot)}`);
}

main();
