import type { StartupScenario } from "./types";

export const DEMO_SCENARIO: StartupScenario = {
  region: "부산 대학가",
  budget: 50000000,
  business_type: "배달+매장 혼합",
  target_monthly_sales: 30000000,
  preferred_menu: "고기 덮밥",
  startup_experience: "없음",
  selected_menu: "우삼겹 덮밥"
};

export const STEPS = [
  { label: "창업 조건 입력", href: "/dashboard/startup/new" },
  { label: "추천 메뉴", href: "/dashboard/startup/menu" },
  { label: "원가 분석", href: "/dashboard/startup/cost" },
  { label: "공급처 링크", href: "/dashboard/startup/suppliers" },
  { label: "브랜드/인테리어", href: "/dashboard/startup/brand" },
  { label: "운영/홍보", href: "/dashboard/startup/operation" },
  { label: "공동구매", href: "/dashboard/startup/groupbuy" }
];
