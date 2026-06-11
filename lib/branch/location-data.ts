import locationReport from "@/src/data/branch/real/location/metadata/collection_report.json";
import sbiz365Services from "@/src/data/branch/real/location/services/sbiz365_openapi_services.json";
import sdsc2Endpoints from "@/src/data/branch/real/location/services/sdsc2_openapi_endpoints.json";
import locationProfiles from "@/src/data/branch/real/location/profiles/location_profile_cache_seed.json";
import storeCountsBySido from "@/src/data/branch/real/location/aggregates/store_counts_by_sido.json";
import foodCountsBySido from "@/src/data/branch/real/location/aggregates/food_store_counts_by_sido.json";
import industryCodes from "@/src/data/branch/real/location/normalized/industry_codes.json";

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
