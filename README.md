# 브랜치

브랜치는 프랜차이즈 창업 상담 전에 자가 브랜드 창업안과 프랜차이즈 비교안을 같은 화면에서 검토하는 오픈채팅 베타 테스트용 체험데모입니다.

고정 시나리오는 부산 대학가, 창업 자본 5,000만원, 고기덮밥 업종, 대표 자가 브랜드 `육반장`입니다. 사용자는 자가 브랜드 상세 실행안, 프랜차이즈 상세 비교, 메뉴·원가, 공급처·공동구매·입지, 시공 요구사항서, 개점 타임테이블, 상담 슬롯 예약, 상담 현황, 점주 전환 후 3개월 무료 대시보드 미리보기를 한 흐름으로 확인합니다.

## Source Of Truth

새 데모의 기준 데이터는 `gpt_db/ver2`입니다. `npm run db:ver2`가 `gpt_db/ver2/branch_gpt_db_package/gpt_db`의 JSON을 `src/data/branch`로 동기화합니다.

기존 `gpt_db/gpt_db.txt`와 `npm run db:bootstrap`은 깨지지 않게 유지하지만, 브랜치 체험데모 화면은 `src/data/branch`만 사용합니다. 실제 DB 수집 값이 아닌 항목은 화면에서 샘플임을 표시합니다.

이미지 템플릿은 `src/data/branch/assets/brand_asset_manifest.json`에서 관리하며, 정적 파일은 `public/branch/image_template`에서 Next.js 이미지로 서빙합니다. 외부 이미지 생성 API는 아직 연결하지 않았고, 재생성 UI는 기존 템플릿을 보여주는 mock 흐름입니다.

## 실행

```bash
npm install
npm run db:ver2
npm run db:validate
npm run dev
```

빌드 확인:

```bash
npm run build
```

Playwright 주요 흐름 확인:

```bash
npx playwright test tests/branch-navigation.spec.ts tests/branch-state-flow.spec.ts tests/branch-timetable.spec.ts tests/branch-visual.spec.ts
```

## 시연 순서

1. `/dashboard/startup/new`
2. 내 브랜드 vs 프랜차이즈 비교
3. `/dashboard/startup/brand`
4. `/dashboard/startup/franchise`
5. `/dashboard/startup/cost`
6. `/dashboard/startup/suppliers`
7. `/dashboard/startup/build`
8. `/dashboard/startup/timetable`
9. `/dashboard/startup/consultation`
10. `/dashboard/startup/consultation/status`
11. `/dashboard/startup/owner-preview`
12. `/dashboard/startup/beta-metrics`에서 전환 데이터 확인

## 데이터 수집

초기 베타에서는 외부 서버 저장 없이 localStorage에 저장합니다. UI 컴포넌트는 `lib/branch/storage` adapter 인터페이스를 사용합니다. Supabase 환경변수 연결 구조는 남겨두지만, 환경변수가 없거나 연결되지 않아도 localStorage adapter로 전체 데모가 동작합니다.

- `branch_events_v2`
- `branch_consultation_leads_v2`
- `branch_feedback_v2`
- `branch_selected_brand_v2`
- `branch_timeline_v2`
- `branch_timeline_v3`
- `branch_appointments_v3`
- `branch_owner_preview_v2`

`/dashboard/startup/beta-metrics`에서 이벤트, 상담 리드, 피드백을 확인하고 JSON으로 export할 수 있습니다.

## 캘린더 선택

상담사 시간표는 `@fullcalendar/react@6.1.20`과 Standard 플러그인을 사용합니다. npm peer dependency 기준 React 19를 포함하고 MIT 라이선스입니다. 유료 resource timeline 기능은 사용하지 않으며, 상담사 필터와 카테고리 필터로 다중 상담사를 표현합니다.

점주 개점 타임테이블은 D-30 프로젝트 UI가 핵심이므로 커스텀 컴포넌트로 유지합니다. 자세한 비교는 `docs/open-source-calendar-review.md`에 기록했습니다.

## 아직 Mock인 기능

- 실제 상담사 예약 확정
- 상담사 실제 입점
- 공급처 견적 발송
- 공동구매 결제
- 점주 운영 대시보드 실제 POS/배달앱 연동
- 브라우저 인쇄 외의 서버 PDF 생성

## 주의

표시된 매출, 순이익, 비용은 보장 수익이 아니라 샘플 데이터 기반 추정입니다. 프랜차이즈 비용은 계약 전 최신 정보공개서와 본사 상담으로 재확인해야 하며, 공급처 가격은 견적과 샘플 테스트가 필요합니다. API Key는 커밋하지 않습니다.
