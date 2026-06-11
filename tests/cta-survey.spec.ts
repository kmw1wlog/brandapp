import { expect, test } from "playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

test("cta surfaces route or save leads across landing, preview, and owner pages", async ({ page }) => {
  await page.goto(`${baseURL}/onboarding`, { waitUntil: "networkidle" });
  await expect(page.getByText("이메일 없이 먼저 체험 가능")).toBeVisible();
  await page.getByRole("link", { name: "프랜차이즈 상담 전, 내 브랜드안 먼저 보기" }).click();
  await expect(page).toHaveURL(/\/dashboard\/startup\/input/);

  await page.goto(`${baseURL}/dashboard/startup/new`, { waitUntil: "networkidle" });
  const previewCta = page.getByTestId("preview-save-cta");
  await expect(previewCta).toBeVisible();
  await previewCta.getByLabel("이메일").fill("preview@example.com");
  await previewCta.getByRole("button", { name: "저장하고 이어보기" }).click();
  await expect(previewCta.getByText("저장 완료")).toBeVisible();

  await page.goto(`${baseURL}/dashboard/startup/owner-preview`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "상담사 입점 시 연락받기" }).click();
  const ownerCta = page.getByTestId("owner-waitlist");
  await expect(ownerCta).toBeVisible();
  await ownerCta.getByLabel("이메일").fill("owner@example.com");
  await ownerCta.getByRole("button", { name: "우선 연락 신청" }).click();
  await expect(ownerCta.getByText("저장 완료")).toBeVisible();

  const signups = await page.evaluate(() => JSON.parse(window.localStorage.getItem("branch_beta_signups_v1") ?? "[]"));
  expect(signups.length).toBeGreaterThanOrEqual(2);
  expect(signups.some((item: { purpose: string }) => item.purpose === "startup_preview_save")).toBeTruthy();
  expect(signups.some((item: { purpose: string }) => item.purpose === "owner_preview_waitlist")).toBeTruthy();
});

test("floating survey opens from bottom-right and stores benefit survey", async ({ page }) => {
  await page.goto(`${baseURL}/dashboard/startup/brand`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "1분 설문하고 혜택 받기" }).click();

  await expect(page.getByRole("heading", { name: "체험 전에 어떤 준비가 가장 급한지 알려주세요" })).toBeVisible();
  await page.getByLabel("현재 창업 단계").selectOption("예산 계산 중");
  await page.getByLabel("지금 가장 막히는 부분").selectOption("입지/상권 판단");
  await page.getByLabel("언제쯤 개점하고 싶나요?").selectOption("3개월 내");
  await page.getByLabel("현재 예상 자본은?").selectOption("5천만~1억 원");
  await page.getByLabel("어떤 혜택을 먼저 받고 싶나요?").selectOption("상담 질문지 템플릿");
  await page.getByLabel("이메일 또는 전화번호").fill("survey@example.com");
  await page.getByLabel("한 줄 메모").fill("입지 분석과 질문지 생성이 가장 궁금합니다.");
  await page.getByRole("button", { name: "설문 보내기" }).click();

  await expect(page.getByText("설문이 저장되었습니다.")).toBeVisible();

  const feedback = await page.evaluate(() => JSON.parse(window.localStorage.getItem("branch_feedback_v2") ?? "[]"));
  expect(feedback.length).toBeGreaterThan(0);
  expect(feedback[feedback.length - 1].desiredBenefit).toBe("상담 질문지 템플릿");
});
