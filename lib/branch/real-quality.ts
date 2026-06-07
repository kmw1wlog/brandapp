export const dataStatusLabels: Record<string, string> = {
  verified_product: "가격 확인됨",
  public_page_collected: "공개정보 수집",
  price_missing: "가격 미확인",
  delivery_unconfirmed: "배송 확인 필요",
  sample_value: "샘플 값",
  lead_only: "추가 확인 후보",
  rejected: "제외된 URL",
  needs_price_check: "가격 확인 필요"
};

export const dataStatusTone: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  verified_product: "success",
  public_page_collected: "info",
  price_missing: "warning",
  delivery_unconfirmed: "warning",
  sample_value: "default",
  lead_only: "info",
  rejected: "danger",
  needs_price_check: "warning"
};
