export type InfraVerificationStatus =
  | "official_site_verified"
  | "official_site_minimal"
  | "official_site_verified_minimal"
  | "official_listing_verified_detail_fetch_limited"
  | "official_listing_verified_price_call_required"
  | string;

export interface InfraCandidate {
  id: string;
  name: string;
  officialUrl: string;
  category: string;
  busanFit: string | null;
  useFor: string[];
  relevantTasks: string[];
  verificationStatus: InfraVerificationStatus;
  quoteRequired: boolean;
  confidenceScore: number | null;
  sourceFile: string;
  dataPoints?: Record<string, unknown>;
  notes?: string[];
}

export interface EquipmentProductLead {
  id: string;
  supplierId: string | null;
  supplierName: string;
  productName: string;
  productUrl: string;
  category: string;
  displayedPriceKrw: number | null;
  regularPriceKrw: number | null;
  useFor: string;
  verificationStatus: InfraVerificationStatus;
  deliveryInstallationNote: string | null;
  quoteRequired: boolean;
  confidenceScore: number | null;
  sourceFile: string;
}

export interface OperatingCostRef {
  id: string;
  name: string;
  category: string;
  officialUrl: string | null;
  useFor: string[];
  verificationStatus: InfraVerificationStatus;
  quoteRequired: boolean;
  value: number | null;
  unit: string | null;
  monthly209hKrw: number | null;
  values: Record<string, unknown>;
  sourceIds: string[];
  sourceFile: string;
}

export interface InfraMergedData {
  constructionAndConsultingCandidates: InfraCandidate[];
  kitchenEquipmentCandidates: InfraCandidate[];
  equipmentProductLeads: EquipmentProductLead[];
  signagePrintingCandidates: InfraCandidate[];
  posPaymentDeliveryCandidates: InfraCandidate[];
  permitLawRefs: InfraCandidate[];
  locationAndPublicDataRefs: InfraCandidate[];
  operatingCostRefs: OperatingCostRef[];
  counts: {
    construction: number;
    kitchenEquipment: number;
    equipmentLeads: number;
    signagePrinting: number;
    posPaymentDelivery: number;
    permitLaw: number;
    locationAndPublicData: number;
    operatingCost: number;
  };
}
