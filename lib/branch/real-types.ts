export type RealDataStatus =
  | "verified_product"
  | "needs_price_check"
  | "lead_only"
  | "rejected";

export type FranchiseBrand = {
  id: string;
  name: string;
  category: "meat_bowl" | "pork_cutlet" | "bbq_meat" | "other";
  comparisonGroup: "direct" | "adjacent" | "reference";
  monthlyAverageSales: number | null;
  monthlyAverageSalesText?: string;
  storeCountTotal: number | null;
  franchiseStoreCount: number | null;
  companyStoreCount: number | null;
  startupCostMin: number | null;
  startupCostMax: number | null;
  ownerProfit: number | null;
  franchiseFee: number | null;
  educationFee: number | null;
  deposit: number | null;
  interiorCost: number | null;
  equipmentCost: number | null;
  signageCost: number | null;
  initialGoodsCost: number | null;
  otherCost: number | null;
  mainMenu: string[];
  sourceType: "myfranchise_public" | "info_disclosure" | "brand_page" | "collected_report";
  sourceFile: string;
  capturedAt: string;
  confidenceScore: number;
  dataStatus: "public_page_collected" | "sample_value";
  warningNotes: string[];
};

export type StatSummary = {
  count: number;
  min: number | null;
  max: number | null;
  median: number | null;
  average: number | null;
  missingCount: number;
};

export type FranchiseCohort = {
  id: string;
  name: string;
  description: string;
  includedBrandIds: string[];
  excludedBrandIds: string[];
  metrics: {
    monthlyAverageSales: StatSummary;
    startupCost: StatSummary;
    ownerProfit: StatSummary;
    storeCount: StatSummary;
  };
  dataQuality: {
    sampleSize: number;
    missingCounts: Record<string, number>;
    notes: string[];
  };
};

export type FranchiseBenchmarkSummary = {
  label: string;
  sublabel: string;
  fallbackLabel: string;
  sampleSize: number;
  missingCounts: Record<string, number>;
  startupCostMedian: number | null;
  monthlySalesMedian: number | null;
  ownerProfitMedian: number | null;
  storeCountMedian: number | null;
  featuredBrandId: string;
};

export type SupplierProduct = {
  id: string;
  source: "gpt" | "perplexity";
  supplierId: string;
  supplierName: string;
  productName: string;
  productUrl: string;
  category: string;
  subCategory: string;
  ingredientId: string | null;
  origin: string | null;
  storageType: "frozen" | "chilled" | "ambient" | "unknown";
  processingType: string | null;
  packSizeValue: number | null;
  packSizeUnit: string | null;
  displayedPrice: number | null;
  vatIncluded: boolean | null;
  shippingFee: number | null;
  normalizedPricePerKg: number | null;
  normalizedPricePerEach: number | null;
  deliveryToBusan: boolean | null;
  deliveryVerificationStatus: string;
  validForCosting: boolean;
  validForDisplay: boolean;
  validForGroupBuy: boolean;
  dataStatus: RealDataStatus;
  capturedAt: string;
  confidenceScore: number;
  memo: string;
};

export type SupplierLead = {
  id: string;
  supplierName: string;
  productName: string;
  productUrl: string | null;
  pageType: string;
  category: string;
  subCategory: string;
  note: string;
};

export type RejectedSupplierUrl = SupplierLead;

export type IngredientMaster = {
  id: string;
  label: string;
  unit: "kg" | "ea" | "g" | "ml";
  fallbackUnitPrice: number;
  fallbackSource: string;
};

export type IngredientProductMatch = {
  ingredientId: string;
  primaryProductId: string | null;
  fallbackProductIds: string[];
  priceStatus: "confirmed" | "missing_price" | "sample_price";
  usageInCostCalculation: "real_price" | "sample_price" | "excluded";
  notes: string[];
};

export type RealMenuIngredient = {
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  cost: number;
  unitPriceText: string;
  sourceLabel: string;
  priceStatus: "confirmed" | "missing_price" | "sample_price";
  connectedProductId: string | null;
  connectedProductName: string | null;
  connectedProductUrl: string | null;
};

export type RealMenuCost = {
  id: string;
  name: string;
  selling_price: number;
  ingredients: RealMenuIngredient[];
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
