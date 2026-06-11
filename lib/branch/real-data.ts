import realManifest from "@/src/data/branch/real/manifest.json";
import realFranchiseBrands from "@/src/data/branch/real/franchise/franchise_brands.json";
import realFranchiseCohorts from "@/src/data/branch/real/franchise/franchise_cohorts.json";
import realFranchiseSummary from "@/src/data/branch/real/franchise/franchise_benchmark_summary.json";
import realFranchiseQuality from "@/src/data/branch/real/franchise/franchise_data_quality.json";
import realSuppliers from "@/src/data/branch/real/suppliers/suppliers.json";
import realSupplierProducts from "@/src/data/branch/real/suppliers/supplier_products.json";
import realSupplierSnapshots from "@/src/data/branch/real/suppliers/supplier_price_snapshots.json";
import realSupplierLeads from "@/src/data/branch/real/suppliers/supplier_leads.json";
import realRejectedUrls from "@/src/data/branch/real/suppliers/rejected_supplier_urls.json";
import realGroupBuy from "@/src/data/branch/real/suppliers/group_buy_candidates.json";
import realSupplierQuality from "@/src/data/branch/real/suppliers/supplier_data_quality.json";
import realIngredientMaster from "@/src/data/branch/real/cost/ingredient_master.json";
import realIngredientMatches from "@/src/data/branch/real/cost/ingredient_product_matches.json";
import realMenuCosts from "@/src/data/branch/real/cost/menu_costs.json";
import realProfitSimulations from "@/src/data/branch/real/cost/profit_simulations.json";
import realReadiness from "@/src/data/branch/real/readiness/demo_readiness.json";
import { getDefaultFranchise, getFranchiseBenchmarks, getGroupbuyCandidates, getMenuCosts, getProfitSimulations, getSupplierCandidates } from "./data";
import type { FranchiseBenchmarkSummary, FranchiseBrand, FranchiseCohort, IngredientMaster, IngredientProductMatch, RealMenuCost, SupplierProduct } from "./real-types";

export function hasRealBranchData() {
  return Boolean((realManifest as { generatedAt?: string }).generatedAt);
}

export function getRealManifest() {
  return realManifest as Record<string, unknown>;
}

export function getRealFranchiseBrands() {
  return realFranchiseBrands as FranchiseBrand[];
}

export function getRealFranchiseCohorts() {
  return realFranchiseCohorts as FranchiseCohort[];
}

export function getRealFranchiseSummaryOrFallback() {
  if (hasRealBranchData()) return realFranchiseSummary as FranchiseBenchmarkSummary;
  const fallback = getDefaultFranchise();
  return {
    label: "덮덮밥 공개정보 기반 대표 샘플 비교",
    sublabel: "fallback sample",
    fallbackLabel: fallback.brand_name,
    sampleSize: 1,
    missingCounts: {},
    startupCostMedian: fallback.startup_cost_min,
    monthlySalesMedian: fallback.monthly_average_sales,
    ownerProfitMedian: fallback.expected_monthly_profit_min,
    storeCountMedian: null,
    featuredBrandId: fallback.id
  } satisfies FranchiseBenchmarkSummary;
}

export function getRealFeaturedFranchise() {
  const brands = getRealFranchiseBrands();
  return brands.find((brand) => brand.id === getRealFranchiseSummaryOrFallback().featuredBrandId) ?? brands[0] ?? null;
}

export function getRealSupplierProductsOrFallback() {
  return hasRealBranchData() ? (realSupplierProducts as SupplierProduct[]) : getSupplierCandidates();
}

export function getRealVerifiedSupplierProducts() {
  return (realSupplierProducts as SupplierProduct[]).filter((item) => item.dataStatus === "verified_product");
}

export function getRealNeedsPriceProducts() {
  return (realSupplierProducts as SupplierProduct[]).filter((item) => item.dataStatus === "needs_price_check");
}

export function getRealSupplierLeads() {
  return realSupplierLeads as Record<string, unknown>[];
}

export function getRealRejectedSupplierUrls() {
  return realRejectedUrls as Record<string, unknown>[];
}

export function getRealGroupBuyCandidatesOrFallback() {
  return hasRealBranchData() ? (realGroupBuy as Record<string, unknown>[]) : getGroupbuyCandidates();
}

export function getRealIngredientMaster() {
  return realIngredientMaster as IngredientMaster[];
}

export function getRealIngredientProductMatches() {
  return realIngredientMatches as IngredientProductMatch[];
}

export function getRealMenuCostsOrFallback() {
  return hasRealBranchData() ? (realMenuCosts as RealMenuCost[]) : getMenuCosts();
}

export function getRealProfitSimulationsOrFallback() {
  return hasRealBranchData() ? realProfitSimulations : getProfitSimulations();
}

export function getRealReadiness() {
  return realReadiness as Record<string, unknown>;
}

export function getRealSupplierQuality() {
  return realSupplierQuality as Record<string, unknown>;
}

export function getRealFranchiseQuality() {
  return realFranchiseQuality as Record<string, unknown>;
}

export function getRealSuppliers() {
  return realSuppliers as Record<string, unknown>[];
}

export function getRealSupplierSnapshots() {
  return realSupplierSnapshots as Record<string, unknown>[];
}
