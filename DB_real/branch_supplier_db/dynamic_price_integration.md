# 동적 가격 연동 제안

## 1. 공공 기준가격
KAMIS API를 이용해 쌀·양파·대파·마늘 등 농산물의 일별·지역별 도소매 기준가격과 최근 가격 추이를 저장한다.

환경변수 예시:
- `KAMIS_API_KEY`
- KAMIS에서 발급하는 인증 정보

## 2. 공개 온라인 후보
네이버 쇼핑 검색 API로 공개 상품의 상품명, URL, 최저가, 판매몰, 제조사, 브랜드, 카테고리를 주기적으로 가져온다.

환경변수:
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

## 3. B2B 실거래가격
식봄, 미트박스, 지역 도매업체의 실제 회원가·MOQ·배송조건은 공개 검색 API로 충분히 얻을 수 없다.

우선순위:
1. 제휴 API
2. 일별 또는 주별 CSV 피드
3. 점주 주문내역 내보내기
4. 거래명세서·세금계산서 업로드
5. 이용 허가를 받은 제한적 페이지 수집

## 4. 내부 가격 테이블
가격은 상품 마스터와 분리해 시계열로 저장한다.

필수 키:
- product_id
- observed_at
- regular_price
- coupon_price
- shipping_fee
- vat_included
- MOQ
- stock_status
- normalized unit price
- collection_method

## 5. 비교식
실구매 예상액은 상품가만 비교하지 않는다.

`실구매 예상액 = 상품가 + 배송비 + 부가세 - 확정 할인`

회원 자격이나 쿠폰 적용 여부가 불명확한 할인은 제외한다.
