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
