import type { EquipmentProductLead, InfraCandidate, InfraVerificationStatus, OperatingCostRef } from "./infra-types";

export const infraStatusLabel: Record<string, string> = {
  official_site_verified: "공식 출처",
  official_site_minimal: "공식 링크 확인",
  official_site_verified_minimal: "공식 링크 확인",
  official_listing_verified_detail_fetch_limited: "목록 확인",
  official_listing_verified_price_call_required: "가격 상담 필요"
};

export function getInfraStatusLabel(status: InfraVerificationStatus) {
  return infraStatusLabel[status] ?? status;
}

export function shouldShowQuoteRequired(record: InfraCandidate | EquipmentProductLead | OperatingCostRef) {
  return Boolean(record.quoteRequired) || ("displayedPriceKrw" in record && record.displayedPriceKrw == null);
}

export function getInfraPriceLabel(price: number | null) {
  if (price == null) return "견적 필요";
  return `${price.toLocaleString("ko-KR")}원`;
}

export function hasManualCheckNote(record: InfraCandidate | EquipmentProductLead) {
  if ("deliveryInstallationNote" in record) return Boolean(record.deliveryInstallationNote);
  return Boolean(record.notes?.length);
}
