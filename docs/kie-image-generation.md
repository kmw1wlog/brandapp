# KIE Image Generation

## 입력
브랜드명, asset kind, prompt, template public URL을 사용한다.

## 출력
`/api/branch/images/generate`는 KIE `createTask` payload를 만들고, `/api/branch/images/status`는 task detail 결과를 조회한다. callback route는 후속 저장 연결을 위한 진입점이다.

## 사용 데이터
`KIE_API_KEY`, `KIE_BASE_URL`, `KIE_MODEL`, `KIE_CALLBACK_URL`, `NEXT_PUBLIC_APP_URL`, 브랜드 asset manifest

## fallback 규칙
API 키가 없으면 "외부 이미지 생성 API 연결 전 샘플 동작입니다." 상태로 template 이미지를 유지한다. status 결과의 `resultJson`은 문자열과 객체 모두 파싱한다.

## 테스트 시나리오
`tests/kie-image-flow.spec.ts`와 RFP 테스트에서 API 키 없이 template 이미지가 유지되는지 확인한다.

## 남은 TODO
완료 이미지 URL을 Supabase Storage나 앱 스토리지로 복사해 영구 저장해야 한다.
