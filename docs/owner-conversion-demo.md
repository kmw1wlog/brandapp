# Owner Conversion Demo

## 입력
선택 브랜드, 사용자 입력, 4개월 회계 시뮬레이션, 동적 타임테이블, owner conversion demo 데이터를 사용한다.

## 출력
점주 전환 전 요약, 제공 기능, 3개월 무료 안내, `owner_demo` 계정 상태 저장, 점주 대시보드 미리보기 이동을 제공한다.

## 사용 데이터
`src/data/branch/real/owner_conversion_demo.json`, `branch_owner_conversion_v1`

## fallback 규칙
전환 상태가 없으면 `pre_owner`로 표시한다. 실제 점주 데이터가 없으면 계획값과 샘플 실제값을 비교한다.

## 테스트 시나리오
`tests/owner-conversion.spec.ts`에서 전환 버튼 클릭, localStorage 저장, owner-preview 배너 표시를 검증한다.

## 남은 TODO
실제 계정 권한 변경과 billing trial 생성은 인증/결제 연결 이후 처리한다.
