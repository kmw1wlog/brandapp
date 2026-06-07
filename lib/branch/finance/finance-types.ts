export type OpeningTarget = {
  type: "date" | "days_from_now" | "weeks_from_now" | "months_from_now" | "unknown";
  date?: string;
  days?: number;
  weeks?: number;
  months?: number;
};

export type StartupUserInput = {
  budget: number;
  capital_structure: {
    own_capital: number;
    loan_amount: number;
  };
  region: string;
  category: string;
  operation_type: string;
  opening_target: OpeningTarget;
  target_owner_income: number;
  owner_working_type: "full_time" | "peak_time" | "staff_centered" | string;
  desired_size_pyeong?: number;
  expected_deposit?: number;
  expected_monthly_rent?: number;
  key_money?: number;
  interior_budget?: number;
  equipment_budget?: number;
  delivery_share?: number;
  staff_count?: number;
  marketing_budget?: number;
  cold_storage_capacity?: string;
  owned_equipment?: string[];
};

export type RegionProfile = {
  region_id: string;
  display_name: string;
  rent_range_monthly: [number, number];
  deposit_range: [number, number];
  base_daily_orders: number;
  conservative_daily_orders: number;
  optimistic_daily_orders: number;
  lunch_demand: string;
  dinner_demand: string;
  delivery_demand: string;
  competition_density: string;
  recommended_operation_type: string;
  confidence_score: number;
  source_status: string;
};

export type FinanceScenarioKey = "conservative" | "base" | "optimistic";

export type FinanceAssumptions = {
  operating_days_per_month: number;
  average_order_value: number;
  delivery_share: number;
  food_cost_rate: number;
  packaging_cost_per_order: number;
  delivery_platform_fee_rate: number;
  card_fee_rate: number;
  management_fee: number;
  utilities: number;
  internet_pos: number;
  insurance: number;
  waste_disposal: number;
  monthly_marketing: Record<string, number>;
  one_time_costs_default: {
    deposit: number;
    key_money: number;
    interior: number;
    equipment: number;
    signage: number;
    initial_inventory: number;
    initial_packaging: number;
    initial_marketing: number;
    permit_and_misc: number;
  };
};

export type FinanceMonthRow = {
  month: number;
  label: string;
  dailyOrders: number;
  orders: number;
  grossSales: number;
  deliverySales: number;
  hallSales: number;
  foodCost: number;
  packagingCost: number;
  deliveryPlatformFee: number;
  cardFee: number;
  fixedCosts: number;
  laborCost: number;
  marketingCost: number;
  operatingProfit: number;
  ownerTakeHome: number;
  loanPayment: number;
  endingCash: number;
};

export type FinanceScenarioResult = {
  key: FinanceScenarioKey;
  label: string;
  rows: FinanceMonthRow[];
  breakEvenDailyOrders: number;
  firstCashNeedMonth: number | null;
  endingCashMonth4: number;
  ownerTakeHomeTotal: number;
  targetDailyOrders: number;
};

export type FinanceSimulationResult = {
  input: StartupUserInput;
  regionProfile: RegionProfile;
  assumptions: FinanceAssumptions;
  scenarios: Record<FinanceScenarioKey, FinanceScenarioResult>;
};
