import categoryMasterRaw from "@/src/data/branch/real/experience/category_master.json";
import brandBenchmarksRaw from "@/src/data/branch/real/experience/brand_benchmarks_by_category.json";
import menuEconomicsRaw from "@/src/data/branch/real/experience/menu_economics.json";
import imageTemplatesRaw from "@/src/data/branch/real/experience/image_templates.json";
import simulationRulesRaw from "@/src/data/branch/real/experience/simulation_rules.json";
import virtualBrandTemplatesRaw from "@/src/data/branch/real/experience/virtual_brand_templates.json";
import locationProfilesRaw from "@/src/data/branch/real/location/profiles/location_profile_cache_seed.json";
import type { StartupUserInput } from "./finance/finance-types";

export type ExperienceCategory = {
  category_id: string;
  display_name: string;
  aliases: string[];
  sdsc_codes: Array<{ large: string; middle: string; small: string; label: string }>;
  ftc_industry_names: string[];
  representative_menu_groups: string[];
  delivery_fit: "high" | "medium" | "low";
  turnover: "fast" | "medium" | "slow";
  average_ticket_band: [number, number];
  food_cost_rate_band: [number, number];
  operation_formats: string[];
};

export type ExperienceBenchmark = {
  category_id: string;
  source_year: number;
  sample_size: number;
  startup_sample_size: number;
  monthly_sales_krw: { median: number | null; average: number | null; p25: number | null; p75: number | null };
  startup_cost_krw: { median: number | null; average: number | null; p25: number | null; p75: number | null };
  store_count: { median: number | null; average: number | null };
  open_close: {
    average_new_registration_count: number | null;
    average_closure_like_count: number | null;
    closure_like_rate_by_store: number;
  };
  top_brands: Array<{
    brand_name: string;
    corp_name: string;
    franchise_store_count: number;
    average_monthly_sales_krw: number;
    startup_cost_krw: number | null;
  }>;
};

export type MenuEconomics = {
  category_id: string;
  menu_group: string;
  menu_name: string;
  recommended_price_band_krw: [number, number];
  ingredient_cost_rate_band: [number, number];
  packaging_cost_krw: number;
  delivery_fit: string;
  cooking_time_minutes: number;
  margin_rate_band: [number, number];
  labor_difficulty: string;
};

export type ImageTemplate = {
  template_id: string;
  category_id: string;
  visual_concept: string;
  hero_menu_visual: string;
  signage_style: string;
  primary_color: string;
  package_style: string;
  interior_tone: string;
  prompt: string;
  negative_prompt: string;
  image_path: string;
  local_source_path: string;
  kie_model: string;
  fallbackDuplicate: boolean;
};

export type SimulationRule = {
  category_id: string;
  base_average_order_value_krw: number;
  base_daily_orders: number;
  hall_sales_share: number;
  delivery_sales_share: number;
  food_cost_rate: number;
  labor_cost_rate: number;
  proper_rent_ratio: number;
  location_score_weight: number;
  competition_penalty: number;
  sns_bonus: number;
  tourism_event_bonus: number;
  ramp_up_curve: number[];
  explanation: string;
};

type VirtualBrandTemplate = {
  category_id: string;
  generated_brand_name_candidates: Array<{ name: string; tagline: string }>;
  default_brand_name: string;
  default_tagline: string;
  menu_board_template: string[];
};

type LocationProfile = {
  cacheKey: string;
  administrativeDistrict: string;
  metrics: {
    totalStoresInRadius: number;
    sameLargeStoresInRadius: number;
    sameMiddleStoresInRadius: number;
    sameSmallStoresInRadius: number;
    sameSmallStoreDensityPerKm2: number;
  };
  advantageSignals: string[];
  cautionSignals: string[];
  salesTrend: { estimatedTrendIndex: number };
  deliveryAnalysis: { estimatedDeliveryFit: string; deliveryCompetitionLevel: string };
  snsKeywords: { keywords: string[] };
};

export type ExperienceSimulation = {
  category: ExperienceCategory;
  benchmark: ExperienceBenchmark;
  menus: MenuEconomics[];
  imageTemplates: ImageTemplate[];
  rule: SimulationRule;
  virtualBrand: {
    name: string;
    tagline: string;
    menuBoard: string[];
    template: VirtualBrandTemplate;
  };
  locationProfile: LocationProfile;
  results: {
    averageOrderValue: number;
    adjustedDailyOrders: number;
    monthlySales: number;
    foodCost: number;
    packagingCost: number;
    laborCost: number;
    rentGuardrail: number;
    estimatedOwnerProfit: number;
    locationScore: number;
  };
};

export function getExperienceCategories() {
  return categoryMasterRaw as ExperienceCategory[];
}

export function resolveExperienceCategory(inputCategory: string) {
  const normalized = normalize(inputCategory);
  const categories = getExperienceCategories();
  const exact = categories.find((category) => normalize(category.display_name) === normalized || category.aliases.some((alias) => normalize(alias) === normalized));
  if (exact) return exact;
  return categories.find((category) => [category.display_name, ...category.aliases].some((alias) => normalize(alias).includes(normalized) || normalized.includes(normalize(alias)))) ?? categories[0];
}

export function buildExperienceSimulation(input: StartupUserInput): ExperienceSimulation {
  const category = resolveExperienceCategory(input.category);
  const benchmark = (brandBenchmarksRaw as ExperienceBenchmark[]).find((item) => item.category_id === category.category_id) ?? (brandBenchmarksRaw as ExperienceBenchmark[])[0];
  const menus = (menuEconomicsRaw as MenuEconomics[]).filter((item) => item.category_id === category.category_id);
  const imageTemplates = (imageTemplatesRaw as ImageTemplate[]).filter((item) => item.category_id === category.category_id);
  const rule = (simulationRulesRaw as SimulationRule[]).find((item) => item.category_id === category.category_id) ?? (simulationRulesRaw as SimulationRule[])[0];
  const template = (virtualBrandTemplatesRaw as VirtualBrandTemplate[]).find((item) => item.category_id === category.category_id) ?? (virtualBrandTemplatesRaw as VirtualBrandTemplate[])[0];
  const locationProfile = selectLocationProfile(category.category_id);
  const brandPick = template.generated_brand_name_candidates[0] ?? { name: template.default_brand_name, tagline: template.default_tagline };
  const averageOrderValue = Math.round((category.average_ticket_band[0] + category.average_ticket_band[1]) / 2);
  const locationScore = calculateLocationScore(locationProfile, rule);
  const adjustedDailyOrders = Math.max(25, Math.round(rule.base_daily_orders * locationScore));
  const monthlySales = Math.round(adjustedDailyOrders * averageOrderValue * 26);
  const foodCost = Math.round(monthlySales * rule.food_cost_rate);
  const packagingCost = Math.round(adjustedDailyOrders * 26 * averagePackagingCost(menus));
  const laborCost = Math.round(monthlySales * rule.labor_cost_rate);
  const rentGuardrail = Math.round(monthlySales * rule.proper_rent_ratio);
  const deliveryFee = Math.round(monthlySales * rule.delivery_sales_share * 0.11);
  const cardFee = Math.round(monthlySales * 0.022);
  const estimatedOwnerProfit = Math.round(monthlySales - foodCost - packagingCost - laborCost - rentGuardrail - deliveryFee - cardFee);

  return {
    category,
    benchmark,
    menus,
    imageTemplates,
    rule,
    virtualBrand: {
      name: brandPick.name,
      tagline: brandPick.tagline,
      menuBoard: template.menu_board_template,
      template
    },
    locationProfile,
    results: {
      averageOrderValue,
      adjustedDailyOrders,
      monthlySales,
      foodCost,
      packagingCost,
      laborCost,
      rentGuardrail,
      estimatedOwnerProfit,
      locationScore
    }
  };
}

function selectLocationProfile(categoryId: string) {
  const profiles = locationProfilesRaw as LocationProfile[];
  if (categoryId === "coffee_drink") return profiles.find((profile) => profile.cacheKey.includes("I21201")) ?? profiles[0];
  return profiles[0];
}

function calculateLocationScore(profile: LocationProfile, rule: SimulationRule) {
  const trend = profile.salesTrend.estimatedTrendIndex / 100;
  const advantage = profile.advantageSignals.length * 0.035;
  const caution = profile.cautionSignals.length * 0.045;
  const densityPenalty = Math.min(0.14, profile.metrics.sameSmallStoreDensityPerKm2 / 1000);
  return Number(Math.max(0.68, Math.min(1.24, trend + advantage + rule.sns_bonus + rule.tourism_event_bonus - caution - densityPenalty)).toFixed(2));
}

function averagePackagingCost(menus: MenuEconomics[]) {
  if (menus.length === 0) return 350;
  return Math.round(menus.reduce((sum, menu) => sum + menu.packaging_cost_krw, 0) / menus.length);
}

function normalize(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}
