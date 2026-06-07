# User Input Flow

## 입력
창업 예산, 자기자본/대출, 희망 지역, 업종, 운영 형태, 개점 목표, 목표 월소득, 점주 근무 형태를 받는다. 고급 입력은 평수, 보증금, 월세, 권리금, 인테리어/주방설비 예산, 배달 비중, 직원 수, 마케팅 예산이다.

## 출력
`branch_user_input_v1`에 정규화된 입력값을 저장하고 `/dashboard/startup/new`, `/dashboard/startup/finance`, `/dashboard/startup/timetable`에서 공유한다.

## 사용 데이터
`src/data/branch/real/user_input_schema.json`, `src/data/branch/real/region_profiles.json`

## fallback 규칙
입력 없이 직접 진입하면 부산 대학가, 고기덮밥, 5,000만원, 45일 뒤 개점 목표를 기본값으로 사용한다.

## 테스트 시나리오
`tests/startup-input.spec.ts`에서 입력 저장, 비교 화면 이동, 입력 요약 표시를 검증한다.

## 남은 TODO
사용자별 서버 저장은 Supabase session 연결 이후 추가한다.
