export type StartupScenario = {
  region: string;
  budget: number;
  business_type: string;
  target_monthly_sales: number;
  preferred_menu: string;
  startup_experience: string;
  selected_menu: string;
};

export type Menu = {
  id: string;
  name: string;
  category: string;
  target_area_type: string[];
  target_customer: string[];
  description: string;
  recommended_price: number;
  target_food_cost_rate: number;
  main_ingredients: string[];
  required_packaging: string[];
  required_equipment: string[];
  difficulty_score: number;
  delivery_fit_score: number;
  rotation_score: number;
  recommended_reason: string[];
};

export type Supplier = {
  id: string;
  name: string;
  category: string;
  sub_category: string;
  region: string;
  url: string;
  keywords: string[];
  delivery_type: string[];
  min_order: { value: number; unit: string };
  estimated_price: {
    value: number;
    unit: string;
    range_min: number;
    range_max: number;
    note: string;
  };
  confidence_score: number;
};

export type CostIngredient = {
  ingredient_id?: string;
  name: string;
  category?: string;
  amount_per_serving: number;
  unit: string;
  unit_price?: number;
  unit_price_label?: string;
  cost_estimate: number;
  supplier_keywords?: string[];
};

export type WoosamgyupDetail = {
  menu_id: string;
  menu_name: string;
  serving_basis: string;
  currency: string;
  ingredients: CostIngredient[];
  packaging: CostIngredient[];
  assumptions: {
    delivery_order_ratio: number;
    delivery_platform_fee_rate: number;
    labor_allocation_per_serving: number;
    rent_allocation_per_serving: number;
    utility_and_misc_per_serving: number;
    monthly_fixed_cost: number;
    business_days: number;
  };
  recommended_price: number;
};

export type GroupBuy = {
  id: string;
  item_name: string;
  region: string;
  target_buyers: number;
  current_buyers: number;
  target_quantity: number;
  unit: string;
  estimated_discount_rate_min: number;
  estimated_discount_rate_max: number;
  related_menus: string[];
  supplier_candidates: string[];
  status: string;
  memo: string;
};

export type BrandReference = {
  id: string;
  brand_name: string;
  slogan: string;
  concept: string;
  target_customer: string[];
  color_mood: string[];
  logo_direction: string;
  naver_intro: string;
  delivery_intro: string;
  risk_note: string;
};
