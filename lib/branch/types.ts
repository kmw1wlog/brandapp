export type BranchScenario = {
  scenario_id: string;
  title: string;
  capital: number;
  region: { city: string; area_type: string; display_name: string; exact_location_status: string };
  category: string;
  target_customer: Record<string, string>;
  operating_types: string[];
  default_brand: string;
  default_franchise_comparison: string;
  assumptions: Record<string, unknown>;
  warning_notes: string[];
};

export type FranchiseBenchmark = {
  id: string;
  brand_name: string;
  category: string;
  monthly_average_sales: number | null;
  expected_monthly_profit_min: number | null;
  expected_monthly_profit_max: number | null;
  startup_cost_min: number | null;
  startup_cost_max: number | null;
  franchise_fee: number | null;
  education_fee: number | null;
  interior_cost: number | null;
  other_cost: number | null;
  data_note: string;
  confidence_score: number;
};

export type BrandOption = {
  id: string;
  name: string;
  type: string;
  slogan: string;
  concept: string;
  target_customer: string[];
  operating_type_options: string[];
  store_type_summary: string;
  delivery_type_summary: string;
  initial_capital_store_type: number;
  initial_capital_delivery_type: number;
  expected_monthly_sales_store_type: number;
  expected_monthly_sales_delivery_type: number;
  expected_monthly_profit_store_type: number;
  expected_monthly_profit_delivery_type: number;
  breakeven_months: number;
  brand_freedom_score: number;
  supplier_freedom_score: number;
  cost_defense_score: number;
  opening_difficulty_score: number;
  visual_direction: string;
  logo_direction: string;
  color_mood: string[];
  interior_mood: string;
  packaging_direction: string;
  menu_board_copy: string;
  naver_place_intro: string;
  delivery_app_intro: string;
  risk_notes: string[];
};

export type MenuCost = {
  id: string;
  name: string;
  selling_price: number;
  ingredients: { name: string; amount: number; unit: string; cost: number }[];
  food_cost: number;
  packaging_cost: number;
  target_food_cost_rate: number;
  hall_margin: number;
  delivery_margin: number;
  delivery_fee_assumption: number;
  labor_allocation: number;
  rent_allocation: number;
  gross_margin: number;
  risk_notes: string[];
};

export type ProfitSimulation = {
  scenario_id: string;
  disclaimer: string;
  simulation_assumptions: Record<string, string>;
  months: {
    month: number;
    franchise_sales: number;
    franchise_owner_profit: number;
    own_brand_sales: number;
    own_brand_owner_profit: number;
    reason: string;
    notes: string;
  }[];
};

export type SupplierCandidate = {
  id: string;
  name: string;
  category: string;
  sub_category: string;
  item_keywords: string[];
  region: string;
  estimated_price: number | null;
  min_order: string;
  delivery_type: string;
  storage_risk: string;
  groupbuy_fit_score: number;
  quote_available: boolean;
  source_url: string | null;
  source_type: string;
  confidence_score: number;
  memo: string;
};

export type GroupbuyCandidate = {
  id: string;
  item_name: string;
  region: string;
  current_interest_count: number;
  target_buyers: number;
  target_quantity: number;
  unit: string;
  estimated_discount_rate_min: number;
  estimated_discount_rate_max: number;
  reservation_status: string;
  risk_notes: string[];
  cta_copy: string;
};

export type ConstructionRequirements = Record<string, unknown> & {
  brand_name: string;
  business_type: string;
  operating_type: string;
  target_region: string;
  main_menu: string[];
  pickup_flow: string;
  required_kitchen_equipment: string[];
  required_construction: string[];
  interior_mood: string;
  signage_direction: string;
  must_ask_questions: string[];
  quote_request_message: string;
};

export type EquipmentItem = {
  id: string;
  name: string;
  quantity: number;
  priority: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  notes: string;
};

export type SignageRequirements = Record<string, unknown> & {
  brand_name: string;
  permit_note: string;
  quote_checklist: string[];
};

export type LocationCriteria = {
  scenario_id: string;
  must_have: { criterion: string; weight: number }[];
  red_flags: string[];
  output: string;
};

export type OpeningTask = {
  id: string;
  day: string;
  title: string;
  category: string;
  description: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  requires_consultation: boolean;
  consultation_category?: string;
  output: string;
  status_default: string;
  related_template_id?: string;
};

export type ConsultantCategory = {
  id: string;
  name: string;
  description: string;
  default_duration_minutes: number;
};

export type MockConsultant = {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  available_from: string;
  booking_enabled: boolean;
};

export type AppointmentSlot = {
  consultant_id: string;
  date_offset_days: number;
  time: string;
  status: string;
};

export type BrandAssetKind =
  | "storefront"
  | "interior"
  | "logo"
  | "signature_menu"
  | "menu_board"
  | "packaging"
  | "delivery_thumbnail"
  | "promotion";

export type BrandAsset = {
  id: string;
  brandId: string;
  kind: BrandAssetKind;
  title: string;
  description: string;
  templateUrl: string;
  generatedUrl?: string;
  selectedUrl: string;
  status: "template" | "queued" | "generating" | "generated" | "failed";
};

export type TimelineTaskStatus = "pending" | "in_progress" | "consultation_waiting" | "booked" | "completed" | "blocked";

export type TimelineTaskState = {
  taskId: string;
  status: TimelineTaskStatus;
  targetDate?: string;
  appointmentId?: string;
  note?: string;
};

export type TimelineState = {
  version: 3;
  selectedBrandId: string;
  targetOpenDate: string;
  tasks: Record<string, TimelineTaskState>;
};

export type Consultant = {
  id: string;
  name: string;
  category: string;
  status: "pending_onboarding" | "active" | "inactive";
  description?: string;
};

export type AvailabilitySlot = {
  id: string;
  consultantId: string;
  startAt: string;
  endAt: string;
  status: "available" | "held" | "booked" | "blocked";
};

export type Appointment = {
  id: string;
  consultantId: string;
  taskId?: string;
  categoryId: string;
  startAt: string;
  endAt: string;
  status: "held" | "booked" | "completed" | "cancelled";
  userName: string;
  contact: string;
  brandId: string;
  note?: string;
};

export type AppointmentInput = Omit<Appointment, "id" | "status"> & { status?: Appointment["status"] };

export type ConsultationLeadInput = Omit<ConsultationLead, "id" | "timestamp">;

export type FeedbackInput = Omit<FeedbackEntry, "id" | "timestamp">;

export type ConsultationQuestionCategory = {
  category: string;
  questions: { id: string; question: string }[];
};

export type DashboardCopy = {
  screens: Record<string, {
    main_title: string;
    subtitle: string;
    primary_cta: string;
    secondary_cta: string;
    helper_text: string;
    warning_text: string;
    empty_state: string;
    success_state: string;
  }>;
};

export type BranchEvent = {
  event_name: string;
  timestamp: string;
  page_path: string;
  scenario_id?: string;
  selected_brand_id?: string;
  operating_type?: string;
  category?: string;
  task_id?: string;
  metadata?: Record<string, unknown>;
};

export type ConsultationLead = {
  id: string;
  timestamp: string;
  name: string;
  contact: string;
  region: string;
  capital: string;
  openDate: string;
  category: string;
  brandId: string;
  concern: string;
  taskId?: string;
};

export type BetaSignup = {
  id: string;
  timestamp: string;
  email: string;
  phone?: string;
  purpose: string;
  benefit: string;
  category?: string;
  openDate?: string;
  note?: string;
  pagePath?: string;
};

export type FeedbackEntry = {
  id: string;
  timestamp: string;
  stage: string;
  blocker: string;
  openTimeline: string;
  budgetRange: string;
  desiredBenefit: string;
  consultation: boolean;
  contact?: string;
  note?: string;
};
