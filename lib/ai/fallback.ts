import { getBrandReferences, getGroupBuys, getMenus } from "@/lib/db/local";

export function getFallbackMenuRecommendations() {
  return {
    recommended_menus: getMenus().slice(0, 3),
    summary: "부산 대학가, 5천만원 예산, 배달+매장 혼합 조건에서는 빠른 회전과 배달 적합성이 높은 고기 덮밥형 메뉴가 유리합니다."
  };
}

export function getFallbackCostComment() {
  return {
    ai_comment: [
      "권장 판매가 8,900원 기준 식품 원가율은 약 32%로 덮밥 메뉴의 데모 목표 범위에 들어옵니다.",
      "배달 주문 비중이 60%일 때 플랫폼 수수료가 공헌이익을 크게 줄이므로 리뷰 이벤트와 포장 품질을 같이 관리해야 합니다.",
      "일 26그릇 수준의 손익분기 판매량은 대학가 점심 피크와 저녁 배달을 함께 잡으면 시연 가능한 목표입니다."
    ]
  };
}

export function getFallbackBrandConcepts() {
  return { concepts: getBrandReferences() };
}

export function getFallbackInteriorConcept() {
  return {
    store_concept: "소형 고회전 덮밥 매장",
    color_finish: "딥그린 벽면, 우드 카운터, 오프화이트 타일",
    sign: "두꺼운 한글 간판과 밥그릇 심볼",
    seats: "2인 테이블 5개와 1인 바 좌석 6석",
    kitchen_flow: "밥 보온, 고기 볶음, 토핑, 포장 순서로 일자형 동선",
    pickup_flow: "입구 오른쪽 픽업 선반과 배달 기사 대기 라인 분리",
    lighting: "메뉴 사진이 따뜻하게 보이는 3000K 펜던트 조명",
    menu_board: "카운터 상단에 대표 메뉴 3개와 세트 옵션만 노출",
    fixtures: ["보온밥솥", "웍", "냉동고", "포장 선반", "픽업 랙"],
    image_prompt:
      "Small Korean beef rice bowl restaurant interior, deep green walls, warm wood counter, off-white tiles, compact open kitchen, pickup shelf, cozy university district, realistic commercial interior photography"
  };
}

export function getFallbackHiringPost() {
  return {
    title: "[부산 대학가] 우삼겹 덮밥 매장 주방보조/홀 파트타임 모집",
    intro: "고기한그릇은 빠르고 든든한 덮밥을 만드는 소형 F&B 매장입니다.",
    hours: "평일 10:00~14:00 또는 17:00~21:00 협의",
    wage: "시급 12,000원부터 협의",
    duties: ["밥/토핑 준비", "간단한 볶음 보조", "포장", "홀 정리"],
    preferred: ["점심 피크 근무 가능", "위생 관리 꼼꼼한 분", "초보 가능"],
    apply: "문자 지원: 이름/나이/가능 요일/근무 가능 시간"
  };
}

export function getFallbackDeliveryCopy() {
  return {
    menu_name: "우삼겹 덮밥",
    packaging: "소스 번짐을 줄이는 PP 덮밥용기와 별도 수저/냅킨 세트를 권장합니다.",
    intro: "고소한 우삼겹과 특제 덮밥소스를 따뜻한 밥 위에 올린 든든한 한 그릇입니다.",
    review_event: "사진 리뷰 작성 시 다음 주문에서 토핑 추가 쿠폰을 드립니다.",
    notice: "조리 즉시 포장하며 배달 상황에 따라 30~45분 소요될 수 있습니다.",
    partner_status: "부산 배달대행 파트너 A 상담 필요"
  };
}

export function getFallbackShortformPlan() {
  return {
    concept: "점심 10분 컷, 우삼겹 한 그릇",
    hook: "0~3초: 점심시간 줄 서기 전에 한 그릇 완성",
    visual: "4~8초: 웍에서 우삼겹이 볶이는 클로즈업",
    offer: "9~12초: 8,900원 대표 메뉴와 리뷰 이벤트 노출",
    cta: "13~15초: 부산 대학가 점심은 고기한그릇",
    caption: "빠르게, 든든하게, 오늘 점심은 우삼겹 덮밥.",
    hashtags: ["#부산대학가맛집", "#우삼겹덮밥", "#혼밥추천", "#점심메뉴"],
    brief: "세로 9:16, 고기 볶는 소리와 김 올라오는 컷을 강조하고 가격 자막은 2초 이상 유지"
  };
}

export function getFallbackGroupBuyRecommendations() {
  return {
    candidates: getGroupBuys().slice(0, 3),
    summary: "우삼겹, 쌀, 덮밥용기는 같은 메뉴군의 반복 구매 품목이라 초기 공동구매 후보로 적합합니다."
  };
}

export function fallbackByTask(task: string) {
  switch (task) {
    case "menu_recommendation":
      return getFallbackMenuRecommendations();
    case "cost_comment":
      return getFallbackCostComment();
    case "brand_generation":
      return getFallbackBrandConcepts();
    case "interior_prompt":
      return getFallbackInteriorConcept();
    case "hiring":
      return getFallbackHiringPost();
    case "delivery_copy":
      return getFallbackDeliveryCopy();
    case "shortform":
      return getFallbackShortformPlan();
    case "groupbuy":
      return getFallbackGroupBuyRecommendations();
    default:
      return { message: "브랜치 체험용 기본 응답" };
  }
}
