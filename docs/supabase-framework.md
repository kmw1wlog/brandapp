# Supabase Framework

브랜치 앱의 데이터 관리는 두 층으로 분리한다.

1. 운영 테이블
`leads`, `groupbuy_interests`, `branch_feedback_entries`, `branch_chat_sessions`, `branch_chat_messages`, `branch_user_inputs`

2. 데이터셋 스냅샷
`branch_dataset_registry`, `branch_dataset_snapshots`, `branch_sync_runs`

## 적용 순서

1. `.env.local`에 Supabase / Qwen / Kakao 환경변수 설정
`SUPABASE_DB_HOST`는 이 환경에서 direct host 대신 pooler host를 권장합니다.
예: `aws-1-<region>.pooler.supabase.com`, 사용자명 `postgres.<project_ref>`, 포트 `6543`
2. `npm run db:supabase:apply`
3. `npm run db:supabase:sync`
4. `npm run db:supabase:verify`

## 동기화 대상

`supabase/branch_dataset_manifest.json`에서 관리한다.

- 업종 마스터
- 공정위 벤치마크 요약
- 메뉴 경제성
- 이미지 템플릿
- 시뮬레이션 룰
- 입지 반경 룰
- 입지 후보 랭킹
- SBIZ365 정규화 캐시
- SBIZ365 응답 블루프린트
- 손익 보정 룰

## 원칙

- 대용량 원천 파일 전체를 매번 앱 테이블에 풀어 넣지 않는다.
- 앱이 직접 읽는 정규화 JSON만 스냅샷으로 저장한다.
- 운영성 데이터와 분석성 스냅샷을 같은 테이블에 섞지 않는다.
- 앱 세션 상태는 현재 로컬 우선, 리드/피드백/챗봇 로그는 Supabase 우선으로 저장한다.
