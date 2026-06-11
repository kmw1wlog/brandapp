import { getRegionProfile, normalizeStartupInput } from "@/lib/branch/user-input";
import { getFinanceAssumptions, scenarioLabels, scenarioRamp } from "./finance-defaults";
import type { FinanceAssumptions, FinanceScenarioKey, FinanceScenarioResult, FinanceSimulationResult, RegionProfile, StartupUserInput } from "./finance-types";

const scenarioKeys: FinanceScenarioKey[] = ["conservative", "base", "optimistic"];

export function calculateFinanceSimulation(input: StartupUserInput): FinanceSimulationResult {
  const normalized = normalizeStartupInput(input);
  const assumptions = getFinanceAssumptions();
  const regionProfile = getRegionProfile(normalized);
  return {
    input: normalized,
    assumptions,
    regionProfile,
    scenarios: Object.fromEntries(
      scenarioKeys.map((key) => [key, calculateScenario(key, normalized, regionProfile, assumptions)])
    ) as Record<FinanceScenarioKey, FinanceScenarioResult>
  };
}

export function calculateScenario(
  key: FinanceScenarioKey,
  input: StartupUserInput,
  region: RegionProfile,
  assumptions: FinanceAssumptions
): FinanceScenarioResult {
  const baseDailyOrders = key === "conservative" ? region.conservative_daily_orders : key === "optimistic" ? region.optimistic_daily_orders : region.base_daily_orders;
  const deliveryShare = input.delivery_share ?? assumptions.delivery_share;
  const fixedCosts = (input.expected_monthly_rent ?? median(region.rent_range_monthly)) + assumptions.management_fee + assumptions.utilities + assumptions.internet_pos + assumptions.insurance + assumptions.waste_disposal;
  const laborCost = calculateLaborCost(input.owner_working_type, input.staff_count ?? 1);
  const loanPayment = calculateLoanPayment(input.capital_structure.loan_amount);
  const month0Costs = {
    deposit: input.expected_deposit ?? assumptions.one_time_costs_default.deposit,
    key_money: input.key_money ?? assumptions.one_time_costs_default.key_money,
    interior: input.interior_budget ?? assumptions.one_time_costs_default.interior,
    equipment: input.equipment_budget ?? assumptions.one_time_costs_default.equipment,
    signage: assumptions.one_time_costs_default.signage,
    initial_inventory: assumptions.one_time_costs_default.initial_inventory,
    initial_packaging: assumptions.one_time_costs_default.initial_packaging,
    initial_marketing: assumptions.one_time_costs_default.initial_marketing,
    permit_and_misc: assumptions.one_time_costs_default.permit_and_misc
  };
  const month0EndingCash = safeMoney(input.budget - Object.values(month0Costs).reduce((sum, value) => sum + value, 0));

  let previousEndingCash = month0EndingCash;
  const rows = [
    {
      month: 0,
      label: "0개월차: 개점 전 지출",
      dailyOrders: 0,
      orders: 0,
      grossSales: 0,
      deliverySales: 0,
      hallSales: 0,
      foodCost: 0,
      packagingCost: 0,
      deliveryPlatformFee: 0,
      cardFee: 0,
      fixedCosts: 0,
      laborCost: 0,
      marketingCost: assumptions.one_time_costs_default.initial_marketing,
      operatingProfit: -Object.values(month0Costs).reduce((sum, value) => sum + value, 0),
      ownerTakeHome: 0,
      loanPayment: 0,
      endingCash: month0EndingCash
    }
  ];

  for (let month = 1; month <= 4; month += 1) {
    const dailyOrders = safeNumber(baseDailyOrders * scenarioRamp[key][month]);
    const orders = safeNumber(dailyOrders * assumptions.operating_days_per_month);
    const grossSales = safeMoney(orders * assumptions.average_order_value);
    const deliverySales = safeMoney(grossSales * deliveryShare);
    const hallSales = safeMoney(grossSales - deliverySales);
    const foodCost = safeMoney(grossSales * assumptions.food_cost_rate);
    const packagingCost = safeMoney(orders * assumptions.packaging_cost_per_order);
    const deliveryPlatformFee = safeMoney(deliverySales * assumptions.delivery_platform_fee_rate);
    const cardFee = safeMoney(grossSales * assumptions.card_fee_rate);
    const marketingCost = assumptions.monthly_marketing[`month_${month}`] ?? input.marketing_budget ?? 500_000;
    const operatingProfit = safeMoney(grossSales - foodCost - packagingCost - deliveryPlatformFee - cardFee - fixedCosts - laborCost - marketingCost);
    const ownerTakeHome = operatingProfit > input.target_owner_income ? input.target_owner_income : Math.max(0, safeMoney(operatingProfit * 0.5));
    const endingCash = safeMoney(previousEndingCash + operatingProfit - ownerTakeHome - loanPayment);
    previousEndingCash = endingCash;
    rows.push({ month, label: `${month}개월차`, dailyOrders, orders, grossSales, deliverySales, hallSales, foodCost, packagingCost, deliveryPlatformFee, cardFee, fixedCosts, laborCost, marketingCost, operatingProfit, ownerTakeHome, loanPayment, endingCash });
  }

  const averageVariableCostPerOrder =
    assumptions.average_order_value * assumptions.food_cost_rate +
    assumptions.packaging_cost_per_order +
    assumptions.average_order_value * assumptions.card_fee_rate +
    assumptions.average_order_value * deliveryShare * assumptions.delivery_platform_fee_rate;
  const contributionPerOrder = Math.max(1, assumptions.average_order_value - averageVariableCostPerOrder);
  const monthlyFixed = fixedCosts + laborCost + 500_000;
  const breakEvenDailyOrders = Math.ceil(monthlyFixed / contributionPerOrder / assumptions.operating_days_per_month);
  return {
    key,
    label: scenarioLabels[key],
    rows,
    breakEvenDailyOrders,
    firstCashNeedMonth: rows.find((row) => row.endingCash < 0)?.month ?? null,
    endingCashMonth4: rows[4]?.endingCash ?? 0,
    ownerTakeHomeTotal: rows.reduce((sum, row) => sum + row.ownerTakeHome, 0),
    targetDailyOrders: Math.round(rows[4]?.dailyOrders ?? 0)
  };
}

function calculateLaborCost(ownerWorkingType: string, staffCount: number) {
  const hourlyWage = 10_320;
  if (ownerWorkingType === "staff_centered") return safeMoney(2_156_880 * Math.max(1, staffCount));
  if (ownerWorkingType === "peak_time") return safeMoney(hourlyWage * 4 * 26 * Math.max(1, staffCount));
  return safeMoney(hourlyWage * 3 * 22 * Math.max(0, staffCount));
}

function calculateLoanPayment(loanAmount: number) {
  if (!loanAmount) return 0;
  return safeMoney((loanAmount * 0.055) / 12);
}

function median(range: [number, number]) {
  return Math.round((range[0] + range[1]) / 2);
}

function safeNumber(value: number) {
  return Number.isFinite(value) ? Math.round(value * 10) / 10 : 0;
}

function safeMoney(value: number) {
  return Number.isFinite(value) ? Math.round(value) : 0;
}
