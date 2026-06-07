# Codex 전달용 요약

## 핵심 사용자 흐름
1. 최소 입력
2. 자가 브랜드 vs 프랜차이즈 즉시 비교
3. 육반장 상세
4. 메뉴·원가·3개월 순이익 시뮬레이션
5. 공급처·공동구매·입지
6. 시공 요구사항서
7. D-30 개점 타임테이블
8. 상담사 입점 대기 신청
9. 점주 전환 후 3개월 무료 대시보드 미리보기
10. 상시 피드백 위젯

## 우선 사용 파일
- scenarios/busan_meatbowl.json
- franchise/franchise_benchmarks.json
- brand/brand_options.json
- cost/menu_costs.json
- cost/profit_simulations.json
- build/construction_requirements.json
- timetable/opening_tasks.json
- copy/dashboard_copy.json
- copy/consultation_questions.json

## 구현 원칙
- 보장수익 표현 금지
- mock 상담사임을 정직하게 표시
- 실가격 미확인 공급처는 견적 확인 필요 표시
- 프랜차이즈와 자가 브랜드를 공정하게 비교
- 메인에서 육반장 완성본을 먼저 보여주고 입력 폼은 최소화
