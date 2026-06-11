import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const realRoot = path.join(root, "src/data/branch/real");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(realRoot, relativePath), "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    console.error(`fail: ${message}`);
    process.exit(1);
  }
  console.log(`ok: ${message}`);
}

function hasNoInvalidCost(menuCosts) {
  return menuCosts.every((menu) => Number.isFinite(menu.food_cost) && menu.ingredients.every((item) => Number.isFinite(item.cost)));
}

const franchiseBrands = readJson("franchise/franchise_brands.json");
const franchiseCohorts = readJson("franchise/franchise_cohorts.json");
const supplierProducts = readJson("suppliers/supplier_products.json");
const supplierLeads = readJson("suppliers/supplier_leads.json");
const rejectedUrls = readJson("suppliers/rejected_supplier_urls.json");
const ingredientMaster = readJson("cost/ingredient_master.json");
const ingredientMatches = readJson("cost/ingredient_product_matches.json");
const menuCosts = readJson("cost/menu_costs.json");
const readiness = readJson("readiness/demo_readiness.json");
const missingBusinessInfra = readJson("infra/missing_business_infra_db.json");
const busanExecutionInfra = readJson("infra/busan_meatbowl_local_execution_db.json");
const regionProfiles = readJson("region_profiles.json");
const accountingAssumptions = readJson("accounting_simulation_assumptions.json");
const timetableRules = readJson("timetable_rules.json");
const ownerConversionDemo = readJson("owner_conversion_demo.json");
const ftcCollectionReport = readJson("ftc/metadata/collection_report.json");
const ftcEndpointStatus = readJson("ftc/metadata/endpoint_status.json");
const ftcFoodServiceIndustryAverages = readJson("ftc/aggregates/food_service_industry_averages_latest.json");
const ftcFoodServiceBrands = readJson("ftc/normalized/food_service_brand_joined_latest.json");
const ftcAreaIndustryAverages = readJson("ftc/normalized/area_industry_average_out_all.json");
const ftcIndustryOpenClose = readJson("ftc/normalized/industry_open_close_out_all.json");
const ftcIndustryFluctuation = readJson("ftc/normalized/industry_fluctuation_all.json");
const sbizCollectionReport = readJson("location/metadata/collection_report.json");
const sbiz365Services = readJson("location/services/sbiz365_openapi_services.json");
const sdsc2Endpoints = readJson("location/services/sdsc2_openapi_endpoints.json");
const locationProfiles = readJson("location/profiles/location_profile_cache_seed.json");
const industryCodes = readJson("location/normalized/industry_codes.json");
const storeCountsBySido = readJson("location/aggregates/store_counts_by_sido.json");
const experienceSummary = readJson("experience/experience_summary.json");
const experienceCategories = readJson("experience/category_master.json");
const experienceBenchmarks = readJson("experience/brand_benchmarks_by_category.json");
const experienceMenus = readJson("experience/menu_economics.json");
const experienceImages = readJson("experience/image_templates.json");
const experienceRules = readJson("experience/simulation_rules.json");

const direct = franchiseCohorts.find((cohort) => cohort.id === "cohort_direct_meat_bowl");
assert(Boolean(direct), "franchise direct cohort exists");
assert((direct?.includedBrandIds?.length ?? 0) >= 7, "franchise direct cohort에 최소 7개 브랜드 존재");
assert(franchiseBrands.some((brand) => brand.name === "덮덮밥"), "덮덮밥 record 존재");
assert(supplierProducts.length >= 80, "supplier_products에 최소 80개 canonical 상품 존재");
assert(supplierProducts.filter((product) => product.source === "perplexity").length >= 10, "perplexity delta 유효 상품 최소 10개 이상 병합");
assert(rejectedUrls.length > 0, "rejected_supplier_urls 존재");
assert(ingredientMaster.length > 0, "ingredient_master 존재");

for (const required of ["beef_woosam", "rice", "onion", "green_onion", "garlic", "egg", "bowl_container"]) {
  assert(ingredientMatches.some((match) => match.ingredientId === required), `${required} 매칭 존재`);
}

assert(hasNoInvalidCost(menuCosts), "메뉴 원가 계산이 NaN 없이 수행");
assert(supplierProducts.every((product) => "productUrl" in product && "dataStatus" in product && "supplierName" in product), "화면에서 쓸 필수 필드 존재");
assert(Array.isArray(readiness.blocked_labels) && readiness.blocked_labels.length > 0, "demo_readiness에 blocked_labels 존재");
assert(supplierLeads.length > 0, "supplier_leads 존재");
assert(Array.isArray(missingBusinessInfra.construction_service_sources), "missing business infra source 존재");
assert(Array.isArray(busanExecutionInfra.construction_and_consulting_candidates), "busan execution infra source 존재");
assert(Array.isArray(regionProfiles) && regionProfiles.length >= 2, "region_profiles 존재");
assert(Number.isFinite(accountingAssumptions.average_order_value), "accounting assumptions 존재");
assert(Array.isArray(timetableRules.base_tasks) && timetableRules.base_tasks.length > 0, "timetable_rules 존재");
assert(Array.isArray(ownerConversionDemo.owner_demo_features), "owner_conversion_demo 존재");
assert(Number.isFinite(ftcCollectionReport.rowCounts?.joinedRows) && ftcCollectionReport.rowCounts.joinedRows > 0, "FTC joined brand rows 존재");
assert(Array.isArray(ftcEndpointStatus) && ftcEndpointStatus.some((item) => item.id === "brand_franchise_stats" && item.status === "ok"), "FTC brand franchise endpoint status 기록");
assert(ftcEndpointStatus.some((item) => item.id === "area_industry_average_out" && item.status === "ok"), "FTC 지역별 외식 평균매출 endpoint status 기록");
assert(ftcEndpointStatus.some((item) => item.id === "industry_open_close_out" && item.status === "ok"), "FTC 외식 개폐점 endpoint status 기록");
assert(ftcEndpointStatus.some((item) => item.id === "industry_fluctuation" && item.status === "ok"), "FTC 업종 변동 endpoint status 기록");
assert(Array.isArray(ftcFoodServiceIndustryAverages) && ftcFoodServiceIndustryAverages.length > 0, "FTC 외식 업종 평균 데이터 존재");
assert(Array.isArray(ftcFoodServiceBrands) && ftcFoodServiceBrands.length > 0, "FTC 외식 브랜드 데이터 존재");
assert(Array.isArray(ftcAreaIndustryAverages) && ftcAreaIndustryAverages.length > 0, "FTC 지역별 외식 평균매출 데이터 존재");
assert(Array.isArray(ftcIndustryOpenClose) && ftcIndustryOpenClose.length > 0, "FTC 외식 개폐점 데이터 존재");
assert(Array.isArray(ftcIndustryFluctuation) && ftcIndustryFluctuation.length > 0, "FTC 업종 변동 데이터 존재");
assert(Number.isFinite(sbizCollectionReport.totalStores) && sbizCollectionReport.totalStores > 2000000, "SBIZ 전국 상가 데이터 집계 존재");
assert(Number.isFinite(sbizCollectionReport.foodServiceStores) && sbizCollectionReport.foodServiceStores > 700000, "SBIZ 음식점업 집계 존재");
assert(Array.isArray(sbiz365Services) && sbiz365Services.length === 11, "소상공인365 11개 서비스 메타데이터 존재");
assert(Array.isArray(sdsc2Endpoints) && sdsc2Endpoints.length === 19, "상가 상권정보 API 19개 endpoint 메타데이터 존재");
assert(Array.isArray(locationProfiles) && locationProfiles.length >= 2, "입지 프로파일 캐시 seed 존재");
assert(locationProfiles.every((profile) => profile.cacheKey && profile.metrics?.sameSmallStoresInRadius != null), "입지 프로파일 필수 지표 존재");
assert(Array.isArray(industryCodes) && industryCodes.some((item) => item.smallCode === "I20302"), "상권 업종코드 I20302 존재");
assert(Array.isArray(storeCountsBySido) && storeCountsBySido.length >= 17, "시도별 상가 집계 존재");
assert(experienceSummary.categoryCount === 11, "체험용 업종 11개 존재");
assert(Array.isArray(experienceCategories) && experienceCategories.some((item) => item.category_id === "rice_bowl"), "체험용 업종 마스터 존재");
assert(Array.isArray(experienceBenchmarks) && experienceBenchmarks.every((item) => item.sample_size >= 1), "체험용 공정위 브랜드 벤치마크 존재");
assert(Array.isArray(experienceMenus) && experienceMenus.length >= 100, "체험용 메뉴 경제성 DB 존재");
assert(Array.isArray(experienceImages) && experienceImages.length === 44, "체험용 KIE 이미지 템플릿 44개 존재");
assert(Array.isArray(experienceRules) && experienceRules.length === 11, "체험용 시뮬레이션 룰 존재");
