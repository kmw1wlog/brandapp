# 모두의창업 데모

AI 기반 F&B 창업 실행 리포트 웹앱 데모입니다. 부산 대학가에서 우삼겹 덮밥집을 창업하려는 사용자가 메뉴, 원가, 공급처, 브랜드, 운영/홍보, 공동구매까지 한 흐름으로 확인할 수 있습니다.

## 설치 및 실행

```bash
npm install
npm run db:bootstrap
npm run dev
```

빌드 확인:

```bash
npm run build
```

## gpt_db 사용법

`gpt_db/gpt_db.txt`를 source of truth로 보고, 구현 시 필요한 데이터는 `src/data/*.json`으로 구조화했습니다.

```bash
npm run db:bootstrap
```

이 명령은 `gpt_db/gpt_db.txt` 존재 여부와 필수 JSON 파일의 유효성을 확인하고 결과를 출력합니다.

## API 없이 fallback demo 실행

환경변수를 설정하지 않아도 전체 7단계 데모가 동작합니다. Qwen/Kie/Supabase 호출은 서버 라우트에서만 선택적으로 시도하며, 실패하거나 키가 없으면 fallback 데이터를 반환합니다.

## Qwen 설정

`.env.local`에만 값을 넣습니다. 키를 코드, README, `.env.example`에 넣지 마세요.

```bash
QWEN_API_KEY=
DASHSCOPE_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
```

## Kie NanoBanana 설정

```bash
KIE_API_KEY=
KIE_BASE_URL=
KIE_NANOBANANA_CREATE_ENDPOINT=
KIE_NANOBANANA_STATUS_ENDPOINT=
KIE_NANOBANANA_MODEL=
KIE_CALLBACK_URL=
```

## Supabase 선택 설정

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Supabase 설정이 없으면 공동구매 관심 등록과 리드는 mock 성공으로 처리됩니다.

## 7단계 시연 순서

1. `/dashboard/startup/new` 접속
2. 기본 입력값 확인
3. `AI 창업안 만들기` 클릭
4. 추천 메뉴 3개 확인
5. `우삼겹 덮밥` 선택
6. 원가 분석 확인
7. 공급처 링크 확인
8. 브랜드/인테리어 확인
9. `인테리어 이미지 생성` 클릭
10. 직원·배달·홍보 실행안 확인
11. 공동구매 화면에서 관심 등록
12. 성공 상태 확인

## 주요 구조

```text
app/dashboard/startup/*      7단계 데모 화면
app/api/*                    Qwen, Kie, Supabase/mock API 라우트
components/*                 대시보드 카드/표/레이아웃
lib/cost.ts                  원가 계산 순수 함수
lib/matching.ts              공급처 키워드 매칭
lib/ai/*                     Qwen adapter와 fallback
lib/image/*                  Kie adapter와 fallback
src/data/*.json              gpt_db 기반 로컬 JSON DB
scripts/bootstrap-gpt-db.mjs JSON bootstrap 스크립트
```

## 주의사항

API Key는 절대 커밋하지 마세요. 브라우저에 노출 가능한 값은 `NEXT_PUBLIC_` 접두사가 붙은 값뿐입니다.
