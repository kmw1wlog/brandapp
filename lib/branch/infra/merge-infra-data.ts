import { loadInfraData } from "./load-infra-data";
import type { EquipmentProductLead, InfraCandidate, InfraMergedData, OperatingCostRef } from "./infra-types";

function toArray<T>(value: unknown) {
  return Array.isArray(value) ? (value as T[]) : [];
}

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function normalizeCandidate(item: Record<string, unknown>, sourceFile: string): InfraCandidate {
  return {
    id: String(item.id),
    name: String(item.name),
    officialUrl: String(item.official_url),
    category: String(item.category ?? "unknown"),
    busanFit: item.busan_fit ? String(item.busan_fit) : null,
    useFor: toArray<string>(item.use_for).map(String),
    relevantTasks: toArray<string>(item.relevant_tasks).map(String),
    verificationStatus: String(item.verification_status ?? "official_site_minimal"),
    quoteRequired: Boolean(item.quote_required),
    confidenceScore: typeof item.confidence_score === "number" ? item.confidence_score : null,
    sourceFile,
    dataPoints: item.data_points && typeof item.data_points === "object" ? (item.data_points as Record<string, unknown>) : undefined
  };
}

function normalizeEquipmentLead(item: Record<string, unknown>, sourceFile: string, supplierLookup: Map<string, string>): EquipmentProductLead {
  const supplierId = item.supplier_id ? String(item.supplier_id) : item.source_id ? String(item.source_id) : null;
  const supplierName = supplierId ? (supplierLookup.get(supplierId) ?? supplierId) : "공급처 확인 필요";
  return {
    id: String(item.id),
    supplierId,
    supplierName,
    productName: String(item.product_name),
    productUrl: String(item.product_url),
    category: String(item.category ?? "unknown"),
    displayedPriceKrw: typeof item.displayed_price_krw === "number" ? item.displayed_price_krw : typeof item.displayed_price === "number" ? item.displayed_price : null,
    regularPriceKrw: typeof item.regular_price_krw === "number" ? item.regular_price_krw : typeof item.regular_price === "number" ? item.regular_price : null,
    useFor: String(item.use_for ?? "주방 장비 후보"),
    verificationStatus: String(item.verification_status ?? "official_listing_verified_detail_fetch_limited"),
    deliveryInstallationNote: item.delivery_installation_note ? String(item.delivery_installation_note) : null,
    quoteRequired: Boolean(item.quote_required) || (typeof item.displayed_price_krw !== "number" && typeof item.displayed_price !== "number"),
    confidenceScore: typeof item.confidence_score === "number" ? item.confidence_score : null,
    sourceFile
  };
}

function normalizeOperatingCost(item: Record<string, unknown>, sourceFile: string): OperatingCostRef {
  const values = item.values && typeof item.values === "object" ? (item.values as Record<string, unknown>) : {};
  return {
    id: String(item.id),
    name: String(item.name),
    category: String(item.category ?? "unknown"),
    officialUrl: item.official_url ? String(item.official_url) : null,
    useFor: toArray<string>(item.use_for).map(String),
    verificationStatus: String(item.verification_status ?? "official_site_minimal"),
    quoteRequired: Boolean(item.quote_required),
    value: typeof item.value === "number" ? item.value : typeof values.hourly_wage_krw === "number" ? values.hourly_wage_krw : null,
    unit: item.unit ? String(item.unit) : typeof values.hourly_wage_krw === "number" ? "KRW_PER_HOUR" : null,
    monthly209hKrw: typeof item.monthly_209h === "number" ? item.monthly_209h : typeof values.monthly_209h_krw === "number" ? values.monthly_209h_krw : null,
    values,
    sourceIds: toArray<string>(item.source_ids).map(String),
    sourceFile
  };
}

function mergeByIdAndUrl<T extends { id: string; officialUrl: string; useFor: string[]; relevantTasks?: string[]; sourceFile: string }>(base: T[], incoming: T[]) {
  const byId = new Map<string, T>();
  const byUrl = new Map<string, T>();

  for (const item of [...base, ...incoming]) {
    const existingById = byId.get(item.id);
    if (existingById) {
      const merged = {
        ...existingById,
        ...item,
        useFor: uniqueStrings([...existingById.useFor, ...item.useFor]),
        relevantTasks: uniqueStrings([...(existingById.relevantTasks ?? []), ...(item.relevantTasks ?? [])]),
        sourceFile: item.sourceFile
      } as T;
      byId.set(item.id, merged);
      byUrl.set(merged.officialUrl, merged);
      continue;
    }

    const existingByUrl = byUrl.get(item.officialUrl);
    if (existingByUrl) {
      const merged = {
        ...existingByUrl,
        ...item,
        useFor: uniqueStrings([...existingByUrl.useFor, ...item.useFor]),
        relevantTasks: uniqueStrings([...(existingByUrl.relevantTasks ?? []), ...(item.relevantTasks ?? [])]),
        id: item.id,
        sourceFile: item.sourceFile
      } as T;
      byId.delete(existingByUrl.id);
      byId.set(merged.id, merged);
      byUrl.set(item.officialUrl, merged);
      continue;
    }

    byId.set(item.id, item);
    byUrl.set(item.officialUrl, item);
  }

  return Array.from(byId.values());
}

function mergeEquipmentLeads(base: EquipmentProductLead[], incoming: EquipmentProductLead[]) {
  const byId = new Map<string, EquipmentProductLead>();
  const byUrl = new Map<string, EquipmentProductLead>();

  for (const item of [...base, ...incoming]) {
    const existing = byId.get(item.id) ?? byUrl.get(item.productUrl);
    if (!existing) {
      byId.set(item.id, item);
      byUrl.set(item.productUrl, item);
      continue;
    }
    const merged = {
      ...existing,
      ...item,
      displayedPriceKrw: item.displayedPriceKrw ?? existing.displayedPriceKrw,
      regularPriceKrw: item.regularPriceKrw ?? existing.regularPriceKrw,
      deliveryInstallationNote: item.deliveryInstallationNote ?? existing.deliveryInstallationNote,
      quoteRequired: item.quoteRequired || existing.quoteRequired
    };
    byId.delete(existing.id);
    byId.set(merged.id, merged);
    byUrl.set(merged.productUrl, merged);
  }

  return Array.from(byId.values());
}

function mergeOperatingCosts(base: OperatingCostRef[], incoming: OperatingCostRef[]) {
  const byId = new Map<string, OperatingCostRef>();

  for (const item of [...base, ...incoming]) {
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, item);
      continue;
    }
    byId.set(item.id, {
      ...existing,
      ...item,
      useFor: uniqueStrings([...existing.useFor, ...item.useFor]),
      sourceIds: uniqueStrings([...existing.sourceIds, ...item.sourceIds]),
      values: { ...existing.values, ...item.values },
      officialUrl: item.officialUrl ?? existing.officialUrl,
      value: item.value ?? existing.value,
      monthly209hKrw: item.monthly209hKrw ?? existing.monthly209hKrw
    });
  }

  return Array.from(byId.values());
}

export function getMergedInfraData(): InfraMergedData {
  const { missingBusinessInfra, busanExecutionInfra } = loadInfraData();

  const baseConstruction = toArray<Record<string, unknown>>(missingBusinessInfra.construction_service_sources).map((item) =>
    normalizeCandidate(item, "missing_business_infra_db.json")
  );
  const baseKitchen = toArray<Record<string, unknown>>(missingBusinessInfra.kitchen_equipment_sources).map((item) =>
    normalizeCandidate(item, "missing_business_infra_db.json")
  );
  const baseSignage = toArray<Record<string, unknown>>(missingBusinessInfra.signage_printing_sources).map((item) =>
    normalizeCandidate(item, "missing_business_infra_db.json")
  );
  const basePosDelivery = toArray<Record<string, unknown>>(missingBusinessInfra.pos_payment_delivery_sources).map((item) =>
    normalizeCandidate(item, "missing_business_infra_db.json")
  );
  const basePermit = toArray<Record<string, unknown>>(missingBusinessInfra.permit_law_refs).map((item) =>
    normalizeCandidate(item, "missing_business_infra_db.json")
  );
  const baseLocation = toArray<Record<string, unknown>>(missingBusinessInfra.location_data_sources).map((item) =>
    normalizeCandidate(item, "missing_business_infra_db.json")
  );
  const baseOperatingCost = toArray<Record<string, unknown>>(missingBusinessInfra.operating_cost_refs).map((item) =>
    normalizeOperatingCost(item, "missing_business_infra_db.json")
  );

  const kitchenCandidateLookup = new Map(baseKitchen.map((item) => [item.id, item.name]));
  const baseEquipmentLeads = toArray<Record<string, unknown>>(missingBusinessInfra.equipment_product_leads).map((item) =>
    normalizeEquipmentLead(item, "missing_business_infra_db.json", kitchenCandidateLookup)
  );

  const incomingConstruction = toArray<Record<string, unknown>>(busanExecutionInfra.construction_and_consulting_candidates).map((item) =>
    normalizeCandidate(item, "busan_meatbowl_local_execution_db.json")
  );
  const incomingKitchen = toArray<Record<string, unknown>>(busanExecutionInfra.kitchen_equipment_candidates).map((item) =>
    normalizeCandidate(item, "busan_meatbowl_local_execution_db.json")
  );
  const incomingSignage = toArray<Record<string, unknown>>(busanExecutionInfra.signage_printing_candidates).map((item) =>
    normalizeCandidate(item, "busan_meatbowl_local_execution_db.json")
  );
  const incomingPosDelivery = toArray<Record<string, unknown>>(busanExecutionInfra.pos_payment_delivery_candidates).map((item) =>
    normalizeCandidate(item, "busan_meatbowl_local_execution_db.json")
  );
  const incomingPermit = toArray<Record<string, unknown>>(busanExecutionInfra.permit_law_refs).map((item) =>
    normalizeCandidate(item, "busan_meatbowl_local_execution_db.json")
  );
  const incomingLocation = toArray<Record<string, unknown>>(busanExecutionInfra.location_and_public_data_refs).map((item) =>
    normalizeCandidate(item, "busan_meatbowl_local_execution_db.json")
  );
  const incomingOperatingCost = toArray<Record<string, unknown>>(busanExecutionInfra.operating_cost_refs).map((item) =>
    normalizeOperatingCost(item, "busan_meatbowl_local_execution_db.json")
  );

  const incomingKitchenLookup = new Map(incomingKitchen.map((item) => [item.id, item.name]));
  const combinedKitchenLookup = new Map([...kitchenCandidateLookup, ...incomingKitchenLookup]);
  const incomingEquipmentLeads = toArray<Record<string, unknown>>(busanExecutionInfra.equipment_product_leads).map((item) =>
    normalizeEquipmentLead(item, "busan_meatbowl_local_execution_db.json", combinedKitchenLookup)
  );

  const constructionAndConsultingCandidates = mergeByIdAndUrl(baseConstruction, incomingConstruction);
  const kitchenEquipmentCandidates = mergeByIdAndUrl(baseKitchen, incomingKitchen);
  const equipmentProductLeads = mergeEquipmentLeads(baseEquipmentLeads, incomingEquipmentLeads);
  const signagePrintingCandidates = mergeByIdAndUrl(baseSignage, incomingSignage);
  const posPaymentDeliveryCandidates = mergeByIdAndUrl(basePosDelivery, incomingPosDelivery);
  const permitLawRefs = mergeByIdAndUrl(basePermit, incomingPermit);
  const locationAndPublicDataRefs = mergeByIdAndUrl(baseLocation, incomingLocation);
  const operatingCostRefs = mergeOperatingCosts(baseOperatingCost, incomingOperatingCost);

  return {
    constructionAndConsultingCandidates,
    kitchenEquipmentCandidates,
    equipmentProductLeads,
    signagePrintingCandidates,
    posPaymentDeliveryCandidates,
    permitLawRefs,
    locationAndPublicDataRefs,
    operatingCostRefs,
    counts: {
      construction: constructionAndConsultingCandidates.length,
      kitchenEquipment: kitchenEquipmentCandidates.length,
      equipmentLeads: equipmentProductLeads.length,
      signagePrinting: signagePrintingCandidates.length,
      posPaymentDelivery: posPaymentDeliveryCandidates.length,
      permitLaw: permitLawRefs.length,
      locationAndPublicData: locationAndPublicDataRefs.length,
      operatingCost: operatingCostRefs.length
    }
  };
}
