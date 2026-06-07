# 브랜치

브랜치는 프랜차이즈 창업 상담 전에 자가 브랜드 창업안과 프랜차이즈 비교안을 같은 화면에서 검토하는 오픈채팅 베타 테스트용 체험데모입니다.

고정 시나리오는 부산 대학가, 창업 자본 5,000만원, 고기덮밥 업종, 대표 자가 브랜드 `육반장`입니다. 사용자는 자가 브랜드 상세 실행안, 메뉴·원가, 공급처·공동구매·입지, 시공 요구사항서, 개점 타임테이블, 상담사 입점 대기 신청, 점주 전환 후 3개월 무료 대시보드 미리보기를 한 흐름으로 확인합니다.

## Source Of Truth

새 데모의 기준 데이터는 `gpt_db/ver2`입니다. `npm run db:ver2`가 `gpt_db/ver2/branch_gpt_db_package/gpt_db`의 JSON을 `src/data/branch`로 동기화합니다.

기존 `gpt_db/gpt_db.txt`와 `npm run db:bootstrap`은 깨지지 않게 유지하지만, 브랜치 체험데모 화면은 `src/data/branch`만 사용합니다.

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

## 시연 순서

1. `/dashboard/startup/new`
2. 내 브랜드 vs 프랜차이즈 비교
3. 이 브랜드 자세히 보기
4. 메뉴·원가 분석
5. 공급처·공동구매·입지
6. 시공 요구사항서
7. 개점 타임테이블
8. 상담신청
9. 점주 대시보드 미리보기
10. `/dashboard/startup/beta-metrics`에서 전환 데이터 확인

## 데이터 수집

초기 베타에서는 외부 서버 저장 없이 localStorage에 저장합니다.

- `branch_events_v2`
- `branch_consultation_leads_v2`
- `branch_feedback_v2`
- `branch_selected_brand_v2`
- `branch_timeline_v2`
- `branch_owner_preview_v2`

`/dashboard/startup/beta-metrics`에서 이벤트, 상담 리드, 피드백을 확인하고 JSON으로 export할 수 있습니다.

## 아직 Mock인 기능

- 상담 예약 확정
- 상담사 실제 입점
- 공급처 견적 발송
- 공동구매 결제
- 점주 운영 대시보드 실제 POS/배달앱 연동
- 실제 PDF 생성

## 주의

표시된 매출, 순이익, 비용은 보장 수익이 아니라 샘플 데이터 기반 추정입니다. 프랜차이즈 비용은 계약 전 최신 정보공개서와 본사 상담으로 재확인해야 하며, 공급처 가격은 견적과 샘플 테스트가 필요합니다. API Key는 커밋하지 않습니다.
