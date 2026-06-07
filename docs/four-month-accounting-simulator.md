# Four Month Accounting Simulator

## 입력
사용자 입력값, 지역 프로필, 회계 기본 가정, 선택 시나리오를 사용한다.

## 출력
0개월차 개점 전 지출과 1~4개월차 회계장부, 현금잔고, 손익분기 주문 수, 추가 자금 필요 시점, 점주 수령 가능액, 민감도 결과를 표시한다.

## 사용 데이터
`src/data/branch/real/accounting_simulation_assumptions.json`, `src/data/branch/real/four_month_accounting_simulation.json`, `src/data/branch/real/region_profiles.json`

## fallback 규칙
숫자가 없거나 잘못되면 기본 입력과 기본 회계 가정을 사용한다. 모든 계산 결과는 finite number로 정규화해 `NaN`, `undefined`, `Infinity`가 보이지 않게 한다.

## 테스트 시나리오
`tests/finance-simulation.spec.ts`에서 브랜드 CTA, finance 진입, 보수적/기준/낙관적 전환, ledger 표시, cost 이동을 검증한다.

## 남은 TODO
실제 POS/배달앱 정산 데이터가 연결되면 샘플 실제값과 계획값 차이를 자동 갱신한다.
