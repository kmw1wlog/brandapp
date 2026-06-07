# Dynamic Opening Timetable

## 입력
`branch_user_input_v1.opening_target`의 date, days_from_now, weeks_from_now, months_from_now 값을 사용한다.

## 출력
준비기간에 따라 압축형, 기본형, 여유형, 상권조사·브랜드 고도화형 타임테이블을 생성하고 기존 완료 상태를 task id 기준으로 보존한다.

## 사용 데이터
`src/data/branch/real/timetable_rules.json`, 인프라 공식 링크 DB

## fallback 규칙
개점 목표가 없으면 45일 뒤 기본형으로 생성한다. 사용자가 날짜를 직접 수정한 태스크는 timeline state에 저장한다.

## 테스트 시나리오
`tests/dynamic-timetable.spec.ts`에서 D-45 기본형, 14일 압축형 재생성, 완료 상태 보존을 검증한다.

## 남은 TODO
상담 예약이 특정 태스크에 연결되면 일정 충돌 경고를 추가한다.
