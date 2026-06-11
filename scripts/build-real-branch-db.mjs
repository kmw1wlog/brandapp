import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outRoot = path.join(root, "src/data/branch/real");

const directBrandNames = [
  "덮덮밥",
  "핵밥",
  "덮밥장사장",
  "바로덮밥",
  "순수덮밥",
  "덮밥슈퍼",
  "1992덮밥&짜글이"
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  const filePath = path.join(outRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function copyJsonTree(sourceRelativePath, targetRelativePath) {
  const sourceRoot = path.join(root, sourceRelativePath);
  if (!fs.existsSync(sourceRoot)) return;
  const entries = fs.readdirSync(sourceRoot, { withFileTypes: true });
  for (const entry of entries) {
    const sourceEntryRelativePath = path.join(sourceRelativePath, entry.name);
    const targetEntryRelativePath = path.join(targetRelativePath, entry.name);
    if (entry.isDirectory()) {
      copyJsonTree(sourceEntryRelativePath, targetEntryRelativePath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    writeJson(targetEntryRelativePath, readJson(sourceEntryRelativePath));
  }
}

function slugify(value) {
  return value.toLowerCase().replace(/[^\w가-힣]+/g, "_").replace(/^_+|_+$/g, "");
}

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

function average(values) {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function summarize(values, sampleSize) {
  const filtered = values.filter((value) => Number.isFinite(value));
  return {
    count: filtered.length,
    min: filtered.length > 0 ? Math.min(...filtered) : null,
    max: filtered.length > 0 ? Math.max(...filtered) : null,
    median: median(filtered),
    average: average(filtered),
    missingCount: sampleSize - filtered.length
  };
}

function extractTextValue(text, regex) {
  const match = text.match(regex);
  return match ? match[1] : null;
}

function parseManwon(text) {
  if (!text) return null;
  const match = String(text).match(/([\d,]+)\s*만원/);
  return match ? Number(match[1].replace(/,/g, "")) * 10000 : null;
}

function parseDeopdeopbapBrand(tab1, tab2) {
  const monthlyAverageSales = parseManwon(extractTextValue(tab2, /월평균 매출[\s\S]*?([\d,]+만원)/));
  const startupCostMin = parseManwon(extractTextValue(tab1, /([\d,]+만원)\s*~\s*최대\s*[\d,]+만원/));
  const startupCostMax = parseManwon(extractTextValue(tab1, /[\d,]+만원\s*~\s*최대\s*([\d,]+만원)/));
  const ownerProfit = 4350000;
  const mainMenu = [...String(tab1).matchAll(/([가-힣A-Za-z]+덮밥|불맛 야끼철판면)\s*\n\n[\d,]+원/g)].map((match) => match[1]);
  return {
    id: "franchise_deopdeopbap",
    name: "덮덮밥",
    category: "meat_bowl",
    comparisonGroup: "direct",
    monthlyAverageSales,
    monthlyAverageSalesText: "1,827만원",
    storeCountTotal: 191,
    franchiseStoreCount: 190,
    companyStoreCount: 1,
    startupCostMin,
    startupCostMax,
    ownerProfit,
    franchiseFee: 3300000,
    educationFee: 2200000,
    deposit: 1000000,
    interiorCost: 20000000,
    equipmentCost: 8000000,
    signageCost: 2000000,
    initialGoodsCost: 1000000,
    otherCost: 15000000,
    mainMenu: mainMenu.length > 0 ? mainMenu.slice(0, 5) : ["덮밥", "삼겹살", "돼지곱창"],
    sourceType: "collected_report",
    sourceFile: "DB_real/collected_brand/tab1_brand_info.txt, DB_real/collected_brand/tab2_franchise_status.txt",
    capturedAt: "2026-06-07",
    confidenceScore: 0.92,
    dataStatus: "public_page_collected",
    warningNotes: [
      "월 수익 예시는 브랜드 직접 입력 참고 수치입니다.",
      "실제 매출과 수익은 상권, 임대료, 인건비, 운영 방식, 점주 역량에 따라 달라질 수 있습니다.",
      "계약 전 정보공개서와 예상매출산정서 재확인 필요"
    ]
  };
}

function buildFranchiseBrands() {
  const tab1 = fs.readFileSync(path.join(root, "DB_real/collected_brand/tab1_brand_info.txt"), "utf8");
  const tab2 = fs.readFileSync(path.join(root, "DB_real/collected_brand/tab2_franchise_status.txt"), "utf8");
  const deop = parseDeopdeopbapBrand(tab1, tab2);
  const direct = directBrandNames.map((name) => {
    if (name === "덮덮밥") return deop;
    return {
      id: `franchise_${slugify(name)}`,
      name,
      category: "meat_bowl",
      comparisonGroup: "direct",
      monthlyAverageSales: null,
      monthlyAverageSalesText: null,
      storeCountTotal: null,
      franchiseStoreCount: null,
      companyStoreCount: null,
      startupCostMin: null,
      startupCostMax: null,
      ownerProfit: null,
      franchiseFee: null,
      educationFee: null,
      deposit: null,
      interiorCost: null,
      equipmentCost: null,
      signageCost: null,
      initialGoodsCost: null,
      otherCost: null,
      mainMenu: [],
      sourceType: "collected_report",
      sourceFile: "DB_real/collected_brand/tab1_brand_info.txt, DB_real/collected_brand/tab2_franchise_status.txt",
      capturedAt: "2026-06-07",
      confidenceScore: 0.45,
      dataStatus: "public_page_collected",
      warningNotes: ["브랜드명 언급만 확보됨", "정량 비교값은 추가 수집 전까지 null 처리"]
    };
  });

  const adjacent = ["엠브로돈까스", "진심왕돈까스"].map((name) => ({
    id: `franchise_${slugify(name)}`,
    name,
    category: "pork_cutlet",
    comparisonGroup: "adjacent",
    monthlyAverageSales: null,
    monthlyAverageSalesText: null,
    storeCountTotal: null,
    franchiseStoreCount: null,
    companyStoreCount: null,
    startupCostMin: null,
    startupCostMax: null,
    ownerProfit: null,
    franchiseFee: null,
    educationFee: null,
    deposit: null,
    interiorCost: null,
    equipmentCost: null,
    signageCost: null,
    initialGoodsCost: null,
    otherCost: null,
    mainMenu: ["돈까스"],
    sourceType: "collected_report",
    sourceFile: "DB_real/collected_brand/tab2_franchise_status.txt",
    capturedAt: "2026-06-07",
    confidenceScore: 0.35,
    dataStatus: "sample_value",
    warningNotes: ["참고군 이름만 확보됨"]
  }));

  const reference = [{
    id: "franchise_dongnaejeong_reference",
    name: "동래정 백탄직화",
    category: "bbq_meat",
    comparisonGroup: "reference",
    monthlyAverageSales: 65800000,
    monthlyAverageSalesText: "6,580만원",
    storeCountTotal: 63,
    franchiseStoreCount: 63,
    companyStoreCount: null,
    startupCostMin: null,
    startupCostMax: null,
    ownerProfit: 10000000,
    franchiseFee: null,
    educationFee: null,
    deposit: null,
    interiorCost: null,
    equipmentCost: null,
    signageCost: null,
    initialGoodsCost: null,
    otherCost: null,
    mainMenu: ["삼겹살"],
    sourceType: "brand_page",
    sourceFile: "src/data/branch/franchise/franchise_benchmarks.json",
    capturedAt: "2026-06-07",
    confidenceScore: 0.55,
    dataStatus: "sample_value",
    warningNotes: ["기존 샘플 benchmark에서 가져온 참고군"]
  }];

  return [...direct, ...adjacent, ...reference];
}

function buildFranchiseCohorts(brands) {
  const groups = [
    {
      id: "cohort_direct_meat_bowl",
      name: "고기덮밥·불백·1인 한식 직접 비교군",
      description: "고기덮밥 프랜차이즈 직접 비교군",
      type: "direct"
    },
    {
      id: "cohort_adjacent_pork_cutlet",
      name: "돈까스 비교군",
      description: "접힌 참고 비교군",
      type: "adjacent"
    },
    {
      id: "cohort_reference_bbq",
      name: "삼겹살 참고군",
      description: "접힌 참고 비교군",
      type: "reference"
    }
  ];

  return groups.map((group) => {
    const included = brands.filter((brand) => brand.comparisonGroup === group.type);
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      includedBrandIds: included.map((brand) => brand.id),
      excludedBrandIds: brands.filter((brand) => brand.comparisonGroup !== group.type).map((brand) => brand.id),
      metrics: {
        monthlyAverageSales: summarize(included.map((brand) => brand.monthlyAverageSales), included.length),
        startupCost: summarize(included.map((brand) => {
          if (brand.startupCostMin == null || brand.startupCostMax == null) return null;
          return Math.round((brand.startupCostMin + brand.startupCostMax) / 2);
        }), included.length),
        ownerProfit: summarize(included.map((brand) => brand.ownerProfit), included.length),
        storeCount: summarize(included.map((brand) => brand.storeCountTotal), included.length)
      },
      dataQuality: {
        sampleSize: included.length,
        missingCounts: {
          monthlyAverageSales: included.filter((brand) => brand.monthlyAverageSales == null).length,
          startupCost: included.filter((brand) => brand.startupCostMin == null || brand.startupCostMax == null).length,
          ownerProfit: included.filter((brand) => brand.ownerProfit == null).length,
          storeCount: included.filter((brand) => brand.storeCountTotal == null).length
        },
        notes: group.type === "direct"
          ? ["덮덮밥만 정량 상세 확보", "나머지 직접 비교군은 브랜드명만 확보되어 null 필드 포함"]
          : ["참고군은 평균 계산 기준이 아니라 펼침 참고 섹션 용도"]
      }
    };
  });
}

function buildFranchiseSummary(cohorts) {
  const direct = cohorts.find((cohort) => cohort.id === "cohort_direct_meat_bowl");
  return {
    label: direct && direct.metrics.monthlyAverageSales.count > 0
      ? "고기덮밥 프랜차이즈 직접 비교군"
      : "덮덮밥 공개정보 기반 대표 샘플 비교",
    sublabel: direct && direct.metrics.monthlyAverageSales.count > 0
      ? "7개 브랜드 공개정보 기반"
      : "덮덮밥 공개정보 기반 대표 샘플 비교",
    fallbackLabel: "덮덮밥 공개정보 기반 대표 샘플 비교",
    sampleSize: direct?.dataQuality.sampleSize ?? 0,
    missingCounts: direct?.dataQuality.missingCounts ?? {},
    startupCostMedian: direct?.metrics.startupCost.median ?? null,
    monthlySalesMedian: direct?.metrics.monthlyAverageSales.median ?? null,
    ownerProfitMedian: direct?.metrics.ownerProfit.median ?? null,
    storeCountMedian: direct?.metrics.storeCount.median ?? null,
    featuredBrandId: "franchise_deopdeopbap"
  };
}

function mergeSuppliers() {
  const canonicalSuppliers = readJson("DB_real/branch_supplier_db/suppliers.json");
  const canonicalProducts = readJson("DB_real/branch_supplier_db/supplier_products.json");
  const canonicalSnapshots = readJson("DB_real/branch_supplier_db/price_snapshots.json");
  const canonicalGroupBuy = readJson("DB_real/branch_supplier_db/group_buy_candidates.json");
  const perplexitySuppliers = readJson("DB_real/perplexity_supplier_db/suppliers.json");
  const perplexityProducts = readJson("DB_real/perplexity_supplier_db/products.json");
  const missingItems = readJson("DB_real/perplexity_supplier_db/missing_items.json");

  const canonicalSupplierMap = new Map(canonicalSuppliers.map((supplier) => [supplier.supplier_id, supplier]));
  const mergedSuppliers = [...canonicalSuppliers];
  for (const supplier of perplexitySuppliers) {
    const existing = mergedSuppliers.find((item) => item.name === supplier.supplier_name || item.official_url === supplier.official_url);
    if (!existing) {
      mergedSuppliers.push({
        supplier_id: `perplexity_${slugify(supplier.supplier_name)}`,
        name: supplier.supplier_name,
        legal_name: null,
        official_url: supplier.official_url,
        business_type: supplier.supplier_type ?? "DELTA_SUPPLIER",
        categories: supplier.categories ?? [],
        delivery_regions: supplier.delivery_regions ?? [],
        delivery_to_busan: null,
        business_member_only: supplier.business_member_only ?? false,
        login_required: supplier.login_required ?? false,
        minimum_order_amount: supplier.minimum_order_amount ?? null,
        free_shipping_threshold: supplier.free_shipping_threshold ?? null,
        quote_url: supplier.quote_url ?? null,
        partnership_url: supplier.partnership_url ?? null,
        customer_service: null,
        tax_invoice_available: null,
        public_api_status: supplier.public_api_status ?? "UNKNOWN",
        terms_or_scraping_note: supplier.memo ?? "perplexity delta supplier",
        captured_at: supplier.captured_at ?? "2026-06-07",
        confidence_score: supplier.confidence_score ?? 0.6
      });
    }
  }

  const snapshotsByProductId = new Map(canonicalSnapshots.map((snapshot) => [snapshot.product_id, snapshot]));
  const mergedProducts = canonicalProducts.map((product) => ({
    id: product.product_id,
    source: "gpt",
    supplierId: product.supplier_id,
    supplierName: canonicalSupplierMap.get(product.supplier_id)?.name ?? product.supplier_id,
    productName: product.product_name,
    productUrl: product.product_url,
    category: product.category,
    subCategory: product.sub_category,
    ingredientId: product.ingredient_id ?? null,
    origin: product.origin ?? null,
    storageType: product.storage_type ?? "unknown",
    processingType: product.processing_type ?? null,
    packSizeValue: product.pack_size_value ?? null,
    packSizeUnit: product.pack_size_unit ?? null,
    displayedPrice: product.displayed_price ?? null,
    vatIncluded: product.vat_included ?? null,
    shippingFee: product.shipping_fee ?? null,
    normalizedPricePerKg: product.normalized_price_per_kg ?? snapshotsByProductId.get(product.product_id)?.normalized_price_per_kg ?? null,
    normalizedPricePerEach: product.normalized_price_per_each ?? snapshotsByProductId.get(product.product_id)?.normalized_price_per_each ?? null,
    deliveryToBusan: product.delivery_to_busan ?? null,
    deliveryVerificationStatus: product.delivery_to_busan == null ? "unknown" : "known",
    validForCosting: Boolean(product.normalized_price_per_kg || product.normalized_price_per_each),
    validForDisplay: true,
    validForGroupBuy: (product.group_buy_fit_score ?? 0) >= 0.6,
    dataStatus: product.displayed_price == null ? "needs_price_check" : "verified_product",
    capturedAt: product.captured_at,
    confidenceScore: product.confidence_score,
    memo: product.memo ?? ""
  }));

  const canonicalUrlSet = new Set(mergedProducts.map((product) => product.productUrl.replace(/\/+$/, "")));
  const validDelta = [];
  const leadOnly = [];
  const rejected = [];

  for (const product of perplexityProducts) {
    const normalizedUrl = product.product_url ? product.product_url.replace(/\/+$/, "") : null;
    if (product.is_valid_product_detail_url === true && product.page_type === "product_detail" && normalizedUrl) {
      if (!canonicalUrlSet.has(normalizedUrl)) {
        validDelta.push({
          id: `perplexity_${product.record_id}`,
          source: "perplexity",
          supplierId: `perplexity_${slugify(product.supplier_name)}`,
          supplierName: product.supplier_name,
          productName: product.product_name,
          productUrl: product.product_url,
          category: product.category,
          subCategory: product.sub_category,
          ingredientId: inferIngredientId(product),
          origin: product.origin ?? null,
          storageType: product.storage_type ?? "unknown",
          processingType: product.processing_type ?? null,
          packSizeValue: product.pack_size_value ?? null,
          packSizeUnit: product.pack_size_unit ?? null,
          displayedPrice: product.displayed_price ?? null,
          vatIncluded: product.vat_included ?? null,
          shippingFee: product.shipping_fee ?? null,
          normalizedPricePerKg: normalizePerplexityUnitPrice(product),
          normalizedPricePerEach: product.pack_size_unit === "ea" ? product.normalized_price_per_kg_or_ea ?? null : null,
          deliveryToBusan: product.delivery_to_busan ?? null,
          deliveryVerificationStatus: product.delivery_verification_status ?? "unknown",
          validForCosting: Boolean(normalizePerplexityUnitPrice(product)),
          validForDisplay: true,
          validForGroupBuy: ["육류", "쌀·채소·계란", "소스·조미료", "포장재", "위생용품"].includes(product.category),
          dataStatus: product.displayed_price == null ? "needs_price_check" : "verified_product",
          capturedAt: product.captured_at,
          confidenceScore: product.source_confidence ?? 0.7,
          memo: product.memo ?? ""
        });
      }
      continue;
    }
    if (["recipe_page", "search_result_only", "candidate_only"].includes(product.page_type)) {
      leadOnly.push({
        id: product.record_id,
        supplierName: product.supplier_name,
        productName: product.product_name,
        productUrl: product.product_url ?? null,
        pageType: product.page_type,
        category: product.category,
        subCategory: product.sub_category,
        note: product.memo ?? "추가 상세 URL 확인 필요"
      });
      continue;
    }
    rejected.push({
      id: product.record_id,
      supplierName: product.supplier_name,
      productName: product.product_name,
      productUrl: product.product_url ?? null,
      pageType: product.page_type,
      category: product.category,
      subCategory: product.sub_category,
      note: product.memo ?? "원가 계산 제외"
    });
  }

  const supplierSnapshots = [
    ...canonicalSnapshots,
    ...validDelta.map((product) => ({
      snapshot_id: `snapshot_${product.id}`,
      product_id: product.id,
      observed_at: product.capturedAt,
      regular_price: product.displayedPrice,
      coupon_price: null,
      shipping_fee: product.shippingFee,
      vat_included: product.vatIncluded,
      normalized_price_per_kg: product.normalizedPricePerKg,
      normalized_price_per_liter: null,
      normalized_price_per_each: product.normalizedPricePerEach,
      stock_status: "unknown",
      collection_method: "perplexity_structured_delta",
      verification_status: product.dataStatus === "verified_product" ? "product_detail_url_verified" : "price_missing"
    }))
  ];

  const groupBuySeed = readJson("src/data/branch/suppliers/groupbuy_candidates.json");
  const mergedGroupBuy = buildGroupBuyCandidates([...mergedProducts, ...validDelta], canonicalGroupBuy, groupBuySeed);

  return {
    suppliers: mergedSuppliers,
    supplierProducts: [...mergedProducts, ...validDelta],
    supplierPriceSnapshots: supplierSnapshots,
    supplierLeads: leadOnly,
    rejectedSupplierUrls: rejected,
    groupBuyCandidates: mergedGroupBuy,
    supplierDataQuality: {
      canonicalSupplierCount: canonicalSuppliers.length,
      mergedSupplierCount: mergedSuppliers.length,
      canonicalProductCount: mergedProducts.length,
      validDeltaCount: validDelta.length,
      leadOnlyCount: leadOnly.length,
      rejectedCount: rejected.length,
      missingItems,
      blockedLabels: ["price_missing", "delivery_unconfirmed", "lead_only", "rejected"]
    }
  };
}

function inferIngredientId(product) {
  const name = product.product_name;
  if (name.includes("우 삼겹") || name.includes("우삼겹")) return "beef_woosam";
  if (name.includes("쌀")) return "rice";
  if (name.includes("고추장")) return "gochujang";
  if (name.includes("마요")) return "mayonnaise";
  if (name.includes("봉투")) return "delivery_bag";
  if (name.includes("용기")) return "bowl_container";
  if (name.includes("장갑")) return "sanitary_glove";
  if (name.includes("양파")) return "onion";
  if (name.includes("대파")) return "green_onion";
  if (name.includes("마늘")) return "garlic";
  if (name.includes("계란")) return "egg";
  return null;
}

function normalizePerplexityUnitPrice(product) {
  if (product.normalized_price_per_kg_or_ea == null) return null;
  if (product.pack_size_unit === "ea") return null;
  return product.normalized_price_per_kg_or_ea;
}

function buildIngredientMaster() {
  return [
    { id: "beef_woosam", label: "우삼겹", unit: "kg", fallbackUnitPrice: 18500, fallbackSource: "sample 18,500원/kg" },
    { id: "pork_foreleg", label: "돼지 전지", unit: "kg", fallbackUnitPrice: 9000, fallbackSource: "sample 9,000원/kg" },
    { id: "pork_neck", label: "돼지 목살", unit: "kg", fallbackUnitPrice: 13000, fallbackSource: "sample 13,000원/kg" },
    { id: "rice", label: "쌀", unit: "kg", fallbackUnitPrice: 1800, fallbackSource: "sample 1,800원/kg" },
    { id: "onion", label: "양파", unit: "kg", fallbackUnitPrice: 1200, fallbackSource: "sample 1,200원/kg" },
    { id: "green_onion", label: "대파", unit: "kg", fallbackUnitPrice: 3000, fallbackSource: "sample 3,000원/kg" },
    { id: "garlic", label: "마늘", unit: "kg", fallbackUnitPrice: 7000, fallbackSource: "sample 7,000원/kg" },
    { id: "egg", label: "계란", unit: "ea", fallbackUnitPrice: 280, fallbackSource: "sample 280원/ea" },
    { id: "gochujang", label: "고추장", unit: "kg", fallbackUnitPrice: 5000, fallbackSource: "sample 5,000원/kg" },
    { id: "soy_sauce", label: "간장", unit: "ml", fallbackUnitPrice: 3.2, fallbackSource: "sample 3.2원/ml" },
    { id: "sugar", label: "설탕", unit: "kg", fallbackUnitPrice: 1300, fallbackSource: "sample 1,300원/kg" },
    { id: "cooking_oil", label: "식용유", unit: "ml", fallbackUnitPrice: 4.8, fallbackSource: "sample 4.8원/ml" },
    { id: "mayonnaise", label: "마요네즈", unit: "kg", fallbackUnitPrice: 3800, fallbackSource: "sample 3,800원/kg" },
    { id: "bowl_container", label: "덮밥용기", unit: "ea", fallbackUnitPrice: 160, fallbackSource: "sample 160원/ea" },
    { id: "delivery_bag", label: "배달봉투", unit: "ea", fallbackUnitPrice: 45, fallbackSource: "sample 45원/ea" },
    { id: "cutlery", label: "수저세트", unit: "ea", fallbackUnitPrice: 52, fallbackSource: "sample 52원/ea" },
    { id: "napkin", label: "냅킨", unit: "ea", fallbackUnitPrice: 1.4, fallbackSource: "sample 1.4원/ea" },
    { id: "foil", label: "쿠킹호일", unit: "ea", fallbackUnitPrice: 2300, fallbackSource: "sample 2,300원/roll" },
    { id: "sanitary_glove", label: "위생장갑", unit: "ea", fallbackUnitPrice: 8.5, fallbackSource: "sample 8.5원/ea" }
  ];
}

function buildIngredientMatches(products, ingredients) {
  const maps = {
    beef_woosam: ["beef_belly_frozen_slice", "beef_woosam"],
    pork_foreleg: ["pork_foreleg_slice"],
    pork_neck: ["pork_neck_shoulder_slice", "pork_neck_shoulder"],
    rice: ["rice_white", "rice"],
    onion: ["onion"],
    green_onion: ["green_onion"],
    garlic: ["garlic_minced", "garlic_minced_frozen", "garlic_peeled"],
    egg: ["egg_large", "egg_special"],
    gochujang: ["gochujang"],
    soy_sauce: ["soy_sauce"],
    sugar: ["sugar"],
    cooking_oil: ["cooking_oil"],
    mayonnaise: ["mayonnaise"],
    bowl_container: ["rice_bowl_container", "meal_container_5comp", "bowl_container"],
    delivery_bag: ["delivery_bag"],
    cutlery: ["cutlery_set"],
    napkin: ["table_napkin"],
    foil: ["plastic_wrap"],
    sanitary_glove: ["sanitary_glove"]
  };

  return ingredients.map((ingredient) => {
    const candidates = products.filter((product) => maps[ingredient.id]?.includes(product.ingredientId ?? ""));
    const primary = candidates.find((product) => product.validForCosting) ?? candidates[0] ?? null;
    return {
      ingredientId: ingredient.id,
      primaryProductId: primary?.id ?? null,
      fallbackProductIds: candidates.slice(1).map((product) => product.id),
      priceStatus: primary?.validForCosting ? "confirmed" : candidates.length > 0 ? "missing_price" : "sample_price",
      usageInCostCalculation: primary?.validForCosting ? "real_price" : "sample_price",
      notes: candidates.length > 0 ? [candidates[0].supplierName] : ["실DB 매칭 부족, 샘플 단가 유지"]
    };
  });
}

function priceForIngredient(products, matches, ingredientId, ingredient, amount, unit) {
  const match = matches.find((item) => item.ingredientId === ingredientId);
  const product = match?.primaryProductId ? products.find((item) => item.id === match.primaryProductId) : null;
  const fallbackUnitPrice = ingredient.fallbackUnitPrice;

  if (product && match?.usageInCostCalculation === "real_price") {
    const unitPrice = unit === "g"
      ? (product.normalizedPricePerKg ?? 0) / 1000
      : unit === "kg"
        ? (product.normalizedPricePerKg ?? 0)
        : product.normalizedPricePerEach ?? 0;
    const cost = Math.round(unitPrice * amount);
    return {
      cost,
      unitPriceText: unit === "g"
        ? `${Math.round(product.normalizedPricePerKg ?? 0).toLocaleString("ko-KR")}원/kg`
        : unit === "kg"
          ? `${Math.round(product.normalizedPricePerKg ?? 0).toLocaleString("ko-KR")}원/kg`
          : `${Math.round(product.normalizedPricePerEach ?? 0).toLocaleString("ko-KR")}원/ea`,
      sourceLabel: "실상품 단가",
      priceStatus: "confirmed",
      connectedProductId: product.id,
      connectedProductName: product.productName,
      connectedProductUrl: product.productUrl
    };
  }

  const sampleUnitPrice = unit === "g"
    ? fallbackUnitPrice / 1000
    : unit === "kg"
      ? fallbackUnitPrice
      : fallbackUnitPrice;
  return {
    cost: Math.round(sampleUnitPrice * amount),
    unitPriceText: ingredient.fallbackSource,
    sourceLabel: product ? "샘플 단가" : "실상품 미매칭",
    priceStatus: product ? "missing_price" : "sample_price",
    connectedProductId: product?.id ?? null,
    connectedProductName: product?.productName ?? null,
    connectedProductUrl: product?.productUrl ?? null
  };
}

function buildRealMenuCosts(products, ingredientMaster, matches) {
  const baseMenus = readJson("src/data/branch/cost/menu_costs.json");
  const menuMappings = {
    menu_woosam_bowl: [
      { name: "수입산 우삼겹", ingredientId: "beef_woosam", amount: 120, unit: "g" },
      { name: "밥", ingredientId: "rice", amount: 200, unit: "g" },
      { name: "양파", ingredientId: "onion", amount: 50, unit: "g" },
      { name: "대파", ingredientId: "green_onion", amount: 10, unit: "g" },
      { name: "덮밥소스", ingredientId: "soy_sauce", amount: 30, unit: "ml" }
    ],
    menu_jeyuk_bowl: [
      { name: "돼지고기 전지", ingredientId: "pork_foreleg", amount: 130, unit: "g" },
      { name: "밥", ingredientId: "rice", amount: 200, unit: "g" },
      { name: "양파", ingredientId: "onion", amount: 40, unit: "g" },
      { name: "대파", ingredientId: "green_onion", amount: 25, unit: "g" },
      { name: "제육소스", ingredientId: "gochujang", amount: 40, unit: "g" }
    ],
    menu_moksal_bowl: [
      { name: "돼지목살", ingredientId: "pork_neck", amount: 125, unit: "g" },
      { name: "밥", ingredientId: "rice", amount: 200, unit: "g" },
      { name: "양파", ingredientId: "onion", amount: 35, unit: "g" },
      { name: "대파", ingredientId: "green_onion", amount: 25, unit: "g" },
      { name: "간장소스", ingredientId: "soy_sauce", amount: 35, unit: "ml" }
    ],
    menu_banjang_set: [
      { name: "우삼겹 덮밥 기본", ingredientId: "beef_woosam", amount: 120, unit: "g" },
      { name: "밥", ingredientId: "rice", amount: 200, unit: "g" },
      { name: "계란", ingredientId: "egg", amount: 1, unit: "ea" },
      { name: "미소장국", ingredientId: "soy_sauce", amount: 20, unit: "ml" },
      { name: "음료", ingredientId: "delivery_bag", amount: 1, unit: "ea" }
    ]
  };

  return baseMenus.map((menu) => {
    const mappedIngredients = (menuMappings[menu.id] ?? []).map((item) => {
      const ingredient = ingredientMaster.find((entry) => entry.id === item.ingredientId);
      const priced = priceForIngredient(products, matches, item.ingredientId, ingredient, item.amount, item.unit);
      return {
        ingredientId: item.ingredientId,
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        cost: priced.cost,
        unitPriceText: priced.unitPriceText,
        sourceLabel: priced.sourceLabel,
        priceStatus: priced.priceStatus,
        connectedProductId: priced.connectedProductId,
        connectedProductName: priced.connectedProductName,
        connectedProductUrl: priced.connectedProductUrl
      };
    });
    const foodCost = mappedIngredients.reduce((sum, ingredient) => sum + ingredient.cost, 0);
    return {
      ...menu,
      ingredients: mappedIngredients,
      food_cost: foodCost
    };
  });
}

function buildGroupBuyCandidates(products, canonicalGroupBuy, existingGroupBuySeed) {
  const canonicalByProductId = new Map(canonicalGroupBuy.map((item) => [item.product_id, item]));
  const seedByName = new Map(existingGroupBuySeed.map((item) => [item.item_name, item]));
  const targets = [
    { ingredientId: "beef_woosam", itemName: "냉동 우삼겹", unit: "kg" },
    { ingredientId: "rice", itemName: "20kg 업소용 쌀", unit: "kg" },
    { ingredientId: "gochujang", itemName: "업소용 고추장", unit: "kg" },
    { ingredientId: "mayonnaise", itemName: "업소용 마요네즈", unit: "kg" },
    { ingredientId: "bowl_container", itemName: "덮밥용기", unit: "ea" },
    { ingredientId: "delivery_bag", itemName: "배달봉투", unit: "ea" },
    { ingredientId: "sanitary_glove", itemName: "위생장갑", unit: "ea" }
  ];

  return targets.map((target, index) => {
    const reps = products.filter((product) => product.ingredientId === target.ingredientId).slice(0, 3);
    const seed = seedByName.get(target.itemName.replace("20kg 업소용 ", "업소용 ").replace("냉동 ", "수입산 ").replace("업소용 ", ""));
    const anyPriced = reps.some((product) => product.displayedPrice != null);
    return {
      id: `real_gb_${target.ingredientId}`,
      ingredientId: target.ingredientId,
      representativeProductIds: reps.map((product) => product.id),
      itemName: target.itemName,
      targetRegion: "부산",
      targetBuyers: seed?.target_buyers ?? 8,
      currentInterestCount: seed?.current_interest_count ?? 2 + index,
      targetQuantity: seed?.target_quantity ?? (target.unit === "kg" ? 200 : 5000),
      unit: target.unit,
      estimatedDiscountRateMin: anyPriced ? seed?.estimated_discount_rate_min ?? 4 : null,
      estimatedDiscountRateMax: anyPriced ? seed?.estimated_discount_rate_max ?? 10 : null,
      dataStatus: anyPriced ? "ready_for_interest" : "needs_supplier_quote",
      riskNotes: anyPriced ? ["표시가격 기준 예비 추정치", "실제 할인율은 공급처 견적 재확인 필요"] : ["공급처 견적 필요", "배송/MOQ 확인 필요"]
    };
  });
}

function buildProfitSimulations(realSummary) {
  const base = readJson("src/data/branch/cost/profit_simulations.json");
  return {
    ...base,
    months: base.months.map((month, index) => ({
      ...month,
      franchise_sales: realSummary.monthlySalesMedian ?? month.franchise_sales,
      franchise_owner_profit: realSummary.ownerProfitMedian ?? month.franchise_owner_profit,
      own_brand_sales: month.own_brand_sales,
      own_brand_owner_profit: month.own_brand_owner_profit + (index === 0 ? 0 : 150000)
    }))
  };
}

function main() {
  const brands = buildFranchiseBrands();
  const cohorts = buildFranchiseCohorts(brands);
  const benchmarkSummary = buildFranchiseSummary(cohorts);
  const supplierOutput = mergeSuppliers();
  const missingBusinessInfra = readJson("DB_real/missing_business_infra_db.json");
  const busanExecutionInfra = readJson("DB_real/busan_meatbowl_local_execution_db.json");
  const userInputSchema = readJson("src/data/branch/real/user_input_schema.json");
  const regionProfiles = readJson("src/data/branch/real/region_profiles.json");
  const accountingAssumptions = readJson("src/data/branch/real/accounting_simulation_assumptions.json");
  const fourMonthSimulation = readJson("src/data/branch/real/four_month_accounting_simulation.json");
  const timetableRules = readJson("src/data/branch/real/timetable_rules.json");
  const ownerConversionDemo = readJson("src/data/branch/real/owner_conversion_demo.json");
  const consultationRfpTemplates = readJson("src/data/branch/real/consultation_rfp_templates.json");
  const marketServices = readJson("src/data/branch/real/market_services.json");
  const ftcCollectionReport = fs.existsSync(path.join(root, "DB_real/ftc_franchise_db/metadata/collection_report.json"))
    ? readJson("DB_real/ftc_franchise_db/metadata/collection_report.json")
    : null;
  const sbizCollectionReport = fs.existsSync(path.join(root, "DB_real/sbiz_location_db/metadata/collection_report.json"))
    ? readJson("DB_real/sbiz_location_db/metadata/collection_report.json")
    : null;
  const experienceSummary = fs.existsSync(path.join(root, "DB_real/experience_db/experience_summary.json"))
    ? readJson("DB_real/experience_db/experience_summary.json")
    : null;
  const ingredientMaster = buildIngredientMaster();
  const ingredientMatches = buildIngredientMatches(supplierOutput.supplierProducts, ingredientMaster);
  const realMenuCosts = buildRealMenuCosts(supplierOutput.supplierProducts, ingredientMaster, ingredientMatches);
  const realProfitSimulations = buildProfitSimulations(benchmarkSummary);
  const costAssumptions = readJson("src/data/branch/cost/cost_assumptions.json");
  const scenario = readJson("src/data/branch/scenarios/busan_meatbowl.json");

  fs.rmSync(outRoot, { recursive: true, force: true });

  writeJson("manifest.json", {
    generatedAt: new Date().toISOString(),
    sourceRoots: [
      "DB_real/branch_supplier_db",
      "DB_real/collected_brand",
      "DB_real/perplexity_supplier_db",
      "DB_real/ftc_franchise_db",
      "DB_real/sbiz_location_db",
      "DB_real/experience_db"
    ],
    counts: {
      franchiseBrandCount: brands.length,
      supplierCount: supplierOutput.suppliers.length,
      supplierProductCount: supplierOutput.supplierProducts.length,
      validDeltaCount: supplierOutput.supplierDataQuality.validDeltaCount,
      ftcJoinedBrandCount: ftcCollectionReport?.rowCounts?.joinedRows ?? 0,
      ftcFoodServiceBrandCount: ftcCollectionReport?.rowCounts?.foodServiceLatestBrandRows ?? 0,
      sbizStoreCount: sbizCollectionReport?.totalStores ?? 0,
      sbizFoodServiceStoreCount: sbizCollectionReport?.foodServiceStores ?? 0,
      experienceCategoryCount: experienceSummary?.categoryCount ?? 0,
      experienceImageTemplateCount: experienceSummary?.imageTemplateCount ?? 0
    }
  });
  writeJson("scenario/busan_meatbowl.json", { ...scenario, real_data_enabled: true });
  writeJson("franchise/franchise_brands.json", brands);
  writeJson("franchise/franchise_cohorts.json", cohorts);
  writeJson("franchise/franchise_benchmark_summary.json", benchmarkSummary);
  writeJson("franchise/franchise_data_quality.json", {
    directCohortBrandCount: directBrandNames.length,
    quantifiedDirectBrandCount: brands.filter((brand) => brand.comparisonGroup === "direct" && brand.monthlyAverageSales != null).length,
    warningNotes: ["직접 비교군 7개 중 덮덮밥만 상세 정량 수치 확보", "나머지 브랜드는 이름만 확보되어 null 필드 존재"]
  });
  writeJson("suppliers/suppliers.json", supplierOutput.suppliers);
  writeJson("suppliers/supplier_products.json", supplierOutput.supplierProducts);
  writeJson("suppliers/supplier_price_snapshots.json", supplierOutput.supplierPriceSnapshots);
  writeJson("suppliers/supplier_leads.json", supplierOutput.supplierLeads);
  writeJson("suppliers/rejected_supplier_urls.json", supplierOutput.rejectedSupplierUrls);
  writeJson("suppliers/group_buy_candidates.json", supplierOutput.groupBuyCandidates);
  writeJson("suppliers/supplier_data_quality.json", supplierOutput.supplierDataQuality);
  writeJson("cost/ingredient_master.json", ingredientMaster);
  writeJson("cost/ingredient_product_matches.json", ingredientMatches);
  writeJson("cost/menu_costs.json", realMenuCosts);
  writeJson("cost/cost_assumptions.json", { ...costAssumptions, real_supplier_product_count: supplierOutput.supplierProducts.length });
  writeJson("cost/profit_simulations.json", realProfitSimulations);
  writeJson("infra/missing_business_infra_db.json", missingBusinessInfra);
  writeJson("infra/busan_meatbowl_local_execution_db.json", busanExecutionInfra);
  writeJson("user_input_schema.json", userInputSchema);
  writeJson("region_profiles.json", regionProfiles);
  writeJson("accounting_simulation_assumptions.json", accountingAssumptions);
  writeJson("four_month_accounting_simulation.json", fourMonthSimulation);
  writeJson("timetable_rules.json", timetableRules);
  writeJson("owner_conversion_demo.json", ownerConversionDemo);
  writeJson("consultation_rfp_templates.json", consultationRfpTemplates);
  writeJson("market_services.json", marketServices);
  copyJsonTree("DB_real/ftc_franchise_db/metadata", "ftc/metadata");
  copyJsonTree("DB_real/ftc_franchise_db/normalized", "ftc/normalized");
  copyJsonTree("DB_real/ftc_franchise_db/aggregates", "ftc/aggregates");
  copyJsonTree("DB_real/sbiz_location_db/metadata", "location/metadata");
  copyJsonTree("DB_real/sbiz_location_db/services", "location/services");
  copyJsonTree("DB_real/sbiz_location_db/normalized", "location/normalized");
  copyJsonTree("DB_real/sbiz_location_db/aggregates", "location/aggregates");
  copyJsonTree("DB_real/sbiz_location_db/profiles", "location/profiles");
  copyJsonTree("DB_real/experience_db", "experience");
  writeJson("readiness/demo_readiness.json", {
    blocked_labels: ["price_missing", "delivery_unconfirmed", "lead_only", "rejected"],
    alerts: [
      "우삼겹 가격 확인 필요",
      "쌀 20kg 후보 있음",
      "포장재 공동구매 후보 있음",
      "배송·MOQ 확인 필요"
    ],
    notes: ["KIE generated image URL is temporary without app storage copy", "직접 비교군 7개 정량 데이터는 부분 확보 상태"]
  });

  console.log(`built real branch db -> ${path.relative(root, outRoot)}`);
}

main();
