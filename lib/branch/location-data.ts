import locationReport from "@/src/data/branch/real/location/metadata/collection_report.json";
import sbiz365Services from "@/src/data/branch/real/location/services/sbiz365_openapi_services.json";
import sdsc2Endpoints from "@/src/data/branch/real/location/services/sdsc2_openapi_endpoints.json";
import locationProfiles from "@/src/data/branch/real/location/profiles/location_profile_cache_seed.json";
import storeCountsBySido from "@/src/data/branch/real/location/aggregates/store_counts_by_sido.json";
import foodCountsBySido from "@/src/data/branch/real/location/aggregates/food_store_counts_by_sido.json";
import industryCodes from "@/src/data/branch/real/location/normalized/industry_codes.json";
import categoryMaster from "@/src/data/branch/real/experience/category_master.json";
import categoryRadiusRules from "@/src/data/branch/real/experience/category_radius_rules.json";
import sbiz365ResponseBlueprints from "@/src/data/branch/real/experience/sbiz365_response_blueprints.json";
import sbiz365ModuleCache from "@/src/data/branch/real/experience/sbiz365_module_cache.json";
import locationCandidateRankings from "@/src/data/branch/real/experience/location_candidate_rankings.json";
import financeLocationAdjustments from "@/src/data/branch/real/experience/finance_location_adjustments.json";

export type Sbiz365Service = {
  id: string;
  name: string;
  route: string;
  url: string;
  requestedAt: string;
  validUntil: string;
  appUsage: string;
};

export type LocationProfile = {
  cacheKey: string;
  sourceTimestamp: string;
  request: {
    id: string;
    label: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    category: {
      largeCode: string;
      largeName: string;
      middleCode: string;
      middleName: string;
      smallCode: string;
      smallName: string;
    };
  };
  administrativeDistrict: string;
  commercialZoneNumber: string | null;
  metrics: {
    totalStoresInRadius: number;
    sameLargeStoresInRadius: number;
    sameMiddleStoresInRadius: number;
    sameSmallStoresInRadius: number;
    totalStoreDensityPerKm2: number;
    foodStoreDensityPerKm2: number;
    sameSmallStoreDensityPerKm2: number;
  };
  topMiddleCategories: Array<{ name: string; count: number }>;
  topSmallCategories: Array<{ name: string; count: number }>;
  salesTrend: { estimatedTrendIndex: number; simulatorUse: string; source: string };
  deliveryAnalysis: { estimatedDeliveryFit: string; deliveryCompetitionLevel: string; source: string };
  businessAgeDistribution: { inferredStability: string; source: string };
  snsKeywords: { keywords: string[]; source: string };
  tourismFestivalEvents: { eventFit: string; source: string };
  advantageSignals: string[];
  cautionSignals: string[];
  nearbyStores: Array<{
    storeId: string;
    name: string;
    distanceMeters: number;
    administrativeDongName: string;
    middleCategoryName: string;
    smallCategoryName: string;
  }>;
};

export type ExperienceCategory = {
  category_id: string;
  display_name: string;
  aliases: string[];
  sdsc_codes: Array<{ large: string; middle: string; small: string; label: string }>;
  ftc_industry_names: string[];
  representative_menu_groups: string[];
  delivery_fit: "low" | "medium" | "high";
  turnover: string;
  average_ticket_band: [number, number];
  food_cost_rate_band: [number, number];
  operation_formats: string[];
};

export type CategoryRadiusRule = {
  category_id: string;
  display_name: string;
  recommended_radius_meters: number;
  secondary_radius_meters: number;
  reason: string;
  delivery_bias: string;
  hall_bias: string;
};

export type Sbiz365ResponseBlueprint = {
  module_id: string;
  name: string;
  official_route: string;
  official_hash_url: string;
  iframe_url_template: string;
  collection_status: string;
  generatedAt: string;
  query_params_example: Record<string, string | number>;
  discovered_endpoints: string[];
  raw_field_paths: string[];
  field_mapping: Record<string, string>;
  normalized_fields: string[];
  simulator_fields: string[];
  drilldown_fields: string[];
};

export type Sbiz365ModuleCacheRecord = {
  lat: number;
  lng: number;
  radiusMeters: number;
  categoryId: string;
  categoryCode: string;
  queryDate: string;
  candidateId: string;
  candidateLabel: string;
  moduleId: string;
  cacheKey: string;
  collection_status: string;
  data_origin: string;
  sourceTimestamp: string;
  summaryScore?: number;
  data: Record<string, unknown>;
};

export type LocationCandidateRanking = {
  candidate_id: string;
  region_label: string;
  category_id: string;
  category_display_name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  headline_score: number;
  sales_score: number;
  competition_score: number;
  delivery_score: number;
  stability_score: number;
  event_bonus_score: number;
  rent_pressure_score: number;
  recommended_operation_type: string;
  summary: string;
  metrics: {
    monthly_average_sales_thousand_krw: number;
    same_category_store_count: number;
    average_monthly_delivery_count: number;
    daily_floating_population: number;
  };
};

export type FinanceLocationAdjustment = {
  category_id: string;
  display_name: string;
  location_score_band: string;
  daily_order_multiplier: number;
  delivery_share_adjustment: number;
  rent_guardrail_ratio: number;
  marketing_ramp_adjustment: number;
  recommended_radius_meters: number;
  confidence_label: string;
};

export function getLocationReport() {
  return locationReport as Record<string, unknown> & {
    totalStores: number;
    foodServiceStores: number;
    storeCsvEntryCount: number;
    industryCodeCount: number;
    profileCacheCount: number;
    cacheKeyRule: string;
  };
}

export function getSbiz365Services() {
  return sbiz365Services as Sbiz365Service[];
}

export function getSdsc2Endpoints() {
  return sdsc2Endpoints as Array<{ id: string; name: string; path: string; url: string; appUsage: string }>;
}

export function getLocationProfiles() {
  return locationProfiles as LocationProfile[];
}

export function getStoreCountsBySido() {
  return storeCountsBySido as Array<{ sidoName: string; count: number }>;
}

export function getFoodCountsBySido() {
  return foodCountsBySido as Array<{ sidoName: string; count: number }>;
}

export function getFoodIndustryCodes() {
  return (industryCodes as Array<{
    largeCode: string;
    largeName: string;
    middleCode: string;
    middleName: string;
    smallCode: string;
    smallName: string;
    demoFoodService: boolean;
  }>).filter((item) => item.demoFoodService);
}

export function getExperienceCategories() {
  return categoryMaster as unknown as ExperienceCategory[];
}

export function getCategoryRadiusRules() {
  return categoryRadiusRules as unknown as CategoryRadiusRule[];
}

export function getSbiz365ResponseBlueprints() {
  return sbiz365ResponseBlueprints as unknown as Sbiz365ResponseBlueprint[];
}

export function getSbiz365ModuleCache() {
  return sbiz365ModuleCache as unknown as Sbiz365ModuleCacheRecord[];
}

export function getLocationCandidateRankings() {
  return locationCandidateRankings as unknown as LocationCandidateRanking[];
}

export function getFinanceLocationAdjustments() {
  return financeLocationAdjustments as unknown as FinanceLocationAdjustment[];
}
