# 고기덮밥집 공급처·SKU 수집 결과

- 수집 기준일: 2026-06-07
- 대상: 부산 대학가 12~18평 고기덮밥 전문점
- 공급주체: 35개
- 실제 상품 상세 URL: 80개
- URL 중복: 0개

## 카테고리별 상품 수
- 육류·계란: 20개
- 쌀: 10개
- 채소·마늘: 15개
- 소스: 10개
- 포장재: 15개
- 위생·일반 소모품: 10개

## 검증 수준
모든 상품은 식봄 공식 카테고리 목록에서 상품명·판매자·표시가격·규격과 링크 대상을 확인했다.
상품 URL은 `https://www.foodspring.co.kr/goods/detail/{상품ID}` 형식으로 정규화했다.

일부 상품 상세페이지는 조사 도구에서 캐시 미스로 본문을 다시 열지 못했기 때문에
`verification_status=official_listing_and_href_verified_detail_fetch_limited`로 기록했다.

## 중요한 한계
1. 공급주체 35개 중 대부분은 식봄 내 판매자다. 독립 공식 홈페이지 35개를 확보했다는 의미는 아니다.
2. 부산 배송 가능 여부, 배송비, MOQ, VAT, 회원가격, 리드타임은 판매자별 수동 확인이 남아 있다.
3. 표시가격은 2026-06-07 시점의 공개 목록 가격이다.
4. 쿠폰가는 자격·행사 조건을 확인하지 않았으므로 원가 계산 기본값에 포함하지 않았다.
5. 가격 자동화는 식봄과의 제휴 API 또는 CSV 피드 협의가 필요하다.

## 파일
- `suppliers.json`: 공급주체 35개
- `supplier_products.json`: SKU 80개
- `price_snapshots.json`: 최초 가격 스냅샷
- `group_buy_candidates.json`: 공동구매 우선 후보
- `api_integration_plan.json`: 동적 가격 연동 계획
- `manual_checks.md`: 남은 수동 검증 목록
