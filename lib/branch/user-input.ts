import regionProfilesRaw from "@/src/data/branch/real/region_profiles.json";
import marketServicesRaw from "@/src/data/branch/real/market_services.json";
import userInputSchemaRaw from "@/src/data/branch/real/user_input_schema.json";
import ownerConversionRaw from "@/src/data/branch/real/owner_conversion_demo.json";
import rfpTemplatesRaw from "@/src/data/branch/real/consultation_rfp_templates.json";
import type { OpeningTarget, RegionProfile, StartupUserInput } from "./finance/finance-types";

export const defaultStartupInput: StartupUserInput = {
  budget: 50_000_000,
  capital_structure: {
    own_capital: 50_000_000,
    loan_amount: 0
  },
  region: "부산 대학가",
  category: "고기덮밥",
  operation_type: "점포+배달 혼합형",
  opening_target: {
    type: "days_from_now",
    days: 45
  },
  target_owner_income: 4_000_000,
  owner_working_type: "full_time",
  desired_size_pyeong: 15,
  expected_deposit: 15_000_000,
  expected_monthly_rent: 2_200_000,
  key_money: 0,
  interior_budget: 22_000_000,
  equipment_budget: 8_000_000,
  delivery_share: 0.45,
  staff_count: 1,
  marketing_budget: 1_000_000,
  cold_storage_capacity: "소형 업소용 냉장·냉동 2대",
  owned_equipment: []
};

export function getRegionProfiles() {
  return regionProfilesRaw as RegionProfile[];
}

export function getMarketServices() {
  return marketServicesRaw as Array<{
    id: string;
    name: string;
    provider: "소상공인365";
    type: "iframe" | "external_link" | "api_pending";
    iframeUrl: string | null;
    externalUrl: string | null;
    enabled: boolean;
    priority: number;
    useInSimulation: boolean;
  }>;
}

export function getUserInputSchema() {
  return userInputSchemaRaw as { required_inputs: string[]; advanced_inputs: string[] };
}

export function getOwnerConversionDemo() {
  return ownerConversionRaw as { account_stages: string[]; free_trial_months: number; owner_demo_features: string[] };
}

export function getRfpTemplates() {
  return rfpTemplatesRaw as Record<string, { title: string; sections: string[]; message_template?: string }>;
}

export function resolveOpeningTargetDate(target: OpeningTarget, now = new Date()) {
  const base = new Date(now);
  base.setHours(12, 0, 0, 0);
  if (target.type === "date" && target.date) return target.date;
  if (target.type === "weeks_from_now") base.setDate(base.getDate() + (target.weeks ?? 4) * 7);
  else if (target.type === "months_from_now") base.setMonth(base.getMonth() + (target.months ?? 1));
  else base.setDate(base.getDate() + (target.days ?? 45));
  return base.toISOString().slice(0, 10);
}

export function daysUntilOpening(target: OpeningTarget, now = new Date()) {
  const targetDate = new Date(resolveOpeningTargetDate(target, now));
  const today = new Date(now);
  targetDate.setHours(12, 0, 0, 0);
  today.setHours(12, 0, 0, 0);
  return Math.max(0, Math.round((targetDate.getTime() - today.getTime()) / 86_400_000));
}

export function getRegionProfile(input: StartupUserInput): RegionProfile {
  const found = getRegionProfiles().find((profile) => profile.display_name === input.region || profile.region_id === input.region);
  if (found) return found;
  return {
    region_id: "custom_region_default",
    display_name: input.region || "직접 입력 지역",
    rent_range_monthly: [input.expected_monthly_rent ?? 1_500_000, input.expected_monthly_rent ?? 2_800_000],
    deposit_range: [input.expected_deposit ?? 10_000_000, input.expected_deposit ?? 25_000_000],
    base_daily_orders: 75,
    conservative_daily_orders: 50,
    optimistic_daily_orders: 105,
    lunch_demand: "medium",
    dinner_demand: "medium",
    delivery_demand: "medium",
    competition_density: "medium",
    recommended_operation_type: input.operation_type,
    confidence_score: 0.25,
    source_status: "지역 추정값"
  };
}

export function normalizeStartupInput(input?: Partial<StartupUserInput> | null): StartupUserInput {
  const next = { ...defaultStartupInput, ...(input ?? {}) };
  return {
    ...next,
    budget: finiteNumber(next.budget, defaultStartupInput.budget),
    capital_structure: {
      own_capital: finiteNumber(next.capital_structure?.own_capital, defaultStartupInput.capital_structure.own_capital),
      loan_amount: finiteNumber(next.capital_structure?.loan_amount, defaultStartupInput.capital_structure.loan_amount)
    },
    opening_target: next.opening_target ?? defaultStartupInput.opening_target,
    target_owner_income: finiteNumber(next.target_owner_income, defaultStartupInput.target_owner_income),
    expected_deposit: finiteNumber(next.expected_deposit, 15_000_000),
    expected_monthly_rent: finiteNumber(next.expected_monthly_rent, 2_200_000),
    key_money: finiteNumber(next.key_money, 0),
    interior_budget: finiteNumber(next.interior_budget, 22_000_000),
    equipment_budget: finiteNumber(next.equipment_budget, 8_000_000),
    delivery_share: clamp(finiteNumber(next.delivery_share, 0.45), 0, 0.9),
    staff_count: finiteNumber(next.staff_count, 1),
    marketing_budget: finiteNumber(next.marketing_budget, 1_000_000)
  };
}

function finiteNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
