# 퍼플렉시티 고기덮밥집 공급처 DB 구조화본

## 포함 파일

- `perplexity_supplier_db_full.json`: 공급처, 상품, 누락 항목, 수집 라운드, 상태를 모두 합친 완전본
- `suppliers.json`, `suppliers.csv`: 공급처 5개
- `products.json`, `products.csv`: 확인 상품·후보·부적합 URL을 포함한 고유 레코드 29개
- `missing_items.json`, `missing_items.csv`: 미확보 또는 상세 URL이 부족한 항목
- `collection_notes.json`: API, 제휴, 로그인, 자동수집, 부산배송, 공동구매 관련 정리
- `collection_rounds.json`: 퍼플렉시티가 단계별로 수집한 내역

## 중요한 구분

- `is_valid_product_detail_url=true`: 상품 상세 URL로 기록된 항목
- `page_type=product_qna`: Q&A 페이지
- `page_type=recipe_page`: 레시피 페이지에서 상품 노출만 확인
- `page_type=category_page_truncated_url`: 카테고리 URL 또는 불완전 URL
- `page_type=search_result_only`: 검색 결과만 있고 상세 URL 없음
- `page_type=candidate_only`: 후보만 기록

## 현재 수집 상태

- 공급처 요약: 5개
- 고유 상품·후보 레코드: 29개
- 유효 상품 상세 URL: 20개
- 상세 URL이 아니거나 URL이 없는 항목: 9개
- 목표 80개 실제 상품 상세 URL: 미달

## 주의

이 파일은 사용자가 제공한 퍼플렉시티 결과를 데이터 손실 없이 구조화한 것이다.
링크의 현재 접속 여부, 가격, 부산 배송, 재고, MOQ, 부가세, 로그인 조건을 별도로 재검증한 파일은 아니다.
