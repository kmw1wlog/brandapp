import type { BrandOption, FranchiseBenchmark, MenuCost, ProfitSimulation } from "./types";

export function calculateMenuMargin(menu: MenuCost) {
  const totalCost = menu.food_cost + menu.packaging_cost;
  return {
    totalCost,
    foodCostRate: menu.food_cost / menu.selling_price,
    hallMarginRate: menu.hall_margin / menu.selling_price,
    deliveryMarginRate: menu.delivery_margin / menu.selling_price
  };
}

export function calculateOwnBrandSummary(brand: BrandOption, operatingType: string) {
  const isDelivery = operatingType === "배달형";
  return {
    initialCapital: isDelivery ? brand.initial_capital_delivery_type : brand.initial_capital_store_type,
    monthlySales: isDelivery ? brand.expected_monthly_sales_delivery_type : brand.expected_monthly_sales_store_type,
    monthlyProfit: isDelivery ? brand.expected_monthly_profit_delivery_type : brand.expected_monthly_profit_store_type,
    breakevenMonths: brand.breakeven_months
  };
}

export function calculateFranchiseSummary(franchise: FranchiseBenchmark) {
  const startupCost = franchise.startup_cost_min && franchise.startup_cost_max
    ? (franchise.startup_cost_min + franchise.startup_cost_max) / 2
    : null;
  const monthlyProfit = franchise.expected_monthly_profit_min && franchise.expected_monthly_profit_max
    ? (franchise.expected_monthly_profit_min + franchise.expected_monthly_profit_max) / 2
    : null;
  return {
    startupCost,
    monthlySales: franchise.monthly_average_sales,
    monthlyProfit
  };
}

export function calculateThreeMonthComparison(simulationData: ProfitSimulation) {
  return simulationData.months.map((month) => ({
    ...month,
    franchiseProfitRate: month.franchise_owner_profit / month.franchise_sales,
    ownBrandProfitRate: month.own_brand_owner_profit / month.own_brand_sales
  }));
}

export function calculateCostDefenseImpact(menu: MenuCost, strategy: string) {
  const rates: Record<string, number> = {
    "공급처 변경": 0.05,
    "원산지 변경": 0.07,
    "세트 구성": 0.04,
    "공동구매 참여": 0.08
  };
  const savingRate = rates[strategy] ?? 0.03;
  const saving = Math.round(menu.food_cost * savingRate);
  return { strategy, saving, revisedFoodCost: menu.food_cost - saving };
}

export function calculateOpeningBudgetBreakdown(constructionMin: number, constructionMax: number, equipment: number, deposit: number) {
  return {
    deposit,
    construction: Math.round((constructionMin + constructionMax) / 2),
    equipment,
    reserve: 5000000
  };
}

export function calculateBreakeven(monthlyFixedCost: number, contributionMargin: number, operatingDays = 26) {
  const monthlyServings = Math.ceil(monthlyFixedCost / contributionMargin);
  return {
    monthlyServings,
    dailyServings: monthlyServings / operatingDays
  };
}
