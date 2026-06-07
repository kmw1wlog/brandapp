import { calculateScenario } from "./finance-calculator";
import { getFinanceAssumptions } from "./finance-defaults";
import type { FinanceScenarioKey, StartupUserInput } from "./finance-types";
import { getRegionProfile } from "@/lib/branch/user-input";

export function calculateSensitivityCards(input: StartupUserInput, scenario: FinanceScenarioKey) {
  const baseAssumptions = getFinanceAssumptions();
  const region = getRegionProfile(input);
  const base = calculateScenario(scenario, input, region, baseAssumptions).endingCashMonth4;
  const cases = [
    { label: "원가율 +5%p", assumptions: { ...baseAssumptions, food_cost_rate: baseAssumptions.food_cost_rate + 0.05 } },
    { label: "주문 수 -20%", region: { ...region, base_daily_orders: Math.round(region.base_daily_orders * 0.8), conservative_daily_orders: Math.round(region.conservative_daily_orders * 0.8), optimistic_daily_orders: Math.round(region.optimistic_daily_orders * 0.8) } },
    { label: "월세 +50만원", input: { ...input, expected_monthly_rent: (input.expected_monthly_rent ?? 0) + 500_000 } },
    { label: "배달 비중 +20%p", input: { ...input, delivery_share: Math.min(0.9, (input.delivery_share ?? baseAssumptions.delivery_share) + 0.2) } }
  ];

  return cases.map((item) => {
    const result = calculateScenario(scenario, item.input ?? input, item.region ?? region, item.assumptions ?? baseAssumptions).endingCashMonth4;
    return {
      label: item.label,
      endingCash: result,
      delta: result - base
    };
  });
}
