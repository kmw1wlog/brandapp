# Consultation RFP Flow

## 입력
선택 브랜드, 사용자 입력값, 브랜드 템플릿 이미지, 시공 요구사항, 장비 후보, 상담 질문 템플릿을 사용한다.

## 출력
브라우저 인쇄 기반 RFP HTML 미리보기, PDF 인쇄 버튼, 상담사에게 보낼 메시지 복사 기능을 제공한다.

## 사용 데이터
`src/data/branch/real/consultation_rfp_templates.json`, `src/data/branch/assets/brand_asset_manifest.json`, `src/data/branch/build/*`, 인프라 DB

## fallback 규칙
KIE 생성 이미지가 없으면 브랜드 템플릿 이미지를 사용한다. 이미지 API 실패 시 기존 이미지를 지우지 않는다.

## 테스트 시나리오
`tests/rfp-generation.spec.ts`에서 브랜드명, 이미지, 주방설비, 상담 질문, PDF 인쇄 버튼, 메시지 복사를 검증한다.

## 남은 TODO
서버 PDF 생성과 상담사 이메일/문자 발송은 다음 단계에서 구현한다.
