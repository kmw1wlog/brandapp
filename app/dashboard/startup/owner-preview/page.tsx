"use client";

import Link from "next/link";
import { Bell, Download, Gift, MessageSquareText, TrendingDown, Users } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { OwnerDashboardPreview } from "@/components/branch/OwnerDashboardPreview";
import { formatKrw, useDemoExperience } from "@/components/branch/DemoExperience";
import { InlineWaitlistCta } from "@/components/branch/InlineWaitlistCta";
import { getMergedInfraData } from "@/lib/branch/infra/merge-infra-data";
import { getRealProfitSimulationsOrFallback, getRealReadiness } from "@/lib/branch/real-data";

export default function OwnerPreviewPage() {
  const { simulation } = useDemoExperience();
  const infra = getMergedInfraData();
  const [showInterestForm, setShowInterestForm] = useState(false);

  return (
    <div className="grid gap-6">
      <header className="rounded-[32px] border border-[#e4dacb] bg-white p-6 text-center shadow-[0_18px_50px_rgba(61,45,27,0.06)]">
        <p className="text-sm font-black text-[#0f7b54]">10 / 10 대시보드 미리보기</p>
        <h2 className="mt-3 text-4xl font-black text-[#171717]">개점 축하드립니다! 🎉</h2>
        <p className="mt-2 text-sm font-bold text-[#6a6258]">{simulation.category.display_name} 브랜드 운영을 기준으로 브랜치가 매출 성장과 비용 관리를 함께 도와드립니다.</p>
      </header>

      <section className="rounded-[32px] border border-[#d7e7df] bg-white p-5 shadow-[0_18px_50px_rgba(31,53,42,0.07)]">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#00853e] to-[#0ca85f] p-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-black">브랜치로 개점한 점주에게 운영 대시보드 3개월 무료</p>
              <p className="mt-3 text-lg font-bold text-white/86">스마트한 운영 관리로 수익을 극대화하세요.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-[#0f7b54]">
              <Gift size={42} />
              <span className="text-2xl font-black">3개월 무료</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          <OwnerCard icon={<Bell />} title="공급망 알림" desc="일부 식자재 가격이 변동됐습니다." value="주의" />
          <OwnerCard icon={<TrendingDown />} title="AI 비용 방어 추천" desc="가격 변동에 따른 비용 방어안을 제안합니다." value="NEW" />
          <OwnerCard icon={<Users />} title="공동구매 기회" desc="지금 참여하면 더 저렴하게 구매할 수 있어요." value="3건" />
          <OwnerCard icon={<MessageSquareText />} title="메뉴별 원가 현황" desc="대표 메뉴 원가율을 계속 추적합니다." value="28.6%" />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.7fr]">
          <section className="rounded-2xl border border-[#e1e9e4] p-5">
            <h3 className="text-lg font-black text-[#172033]">월간 매출/지출 요약</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Mini label="매출" value={formatKrw(simulation.results.monthlySales)} tone="green" />
              <Mini label="지출" value={formatKrw(simulation.results.foodCost + simulation.results.laborCost + simulation.results.packagingCost)} tone="red" />
              <Mini label="순이익" value={formatKrw(simulation.results.estimatedOwnerProfit)} tone="green" />
            </div>
            <div className="mt-5 grid h-36 grid-cols-6 items-end gap-3 border-b border-[#e1e9e4] px-4">
              {[42, 55, 48, 62, 70, 78].map((height, index) => <div key={index} className="rounded-t-lg bg-[#45be78]" style={{ height: `${height}%` }} />)}
            </div>
          </section>

          <section className="rounded-2xl border border-[#e1e9e4] p-5">
            <h3 className="text-lg font-black text-[#172033]">구매 내역</h3>
            <div className="mt-4 grid gap-3 text-sm font-bold">
              {["대파 5kg", "주재료 2kg", "식용유 18L", "포장용기"].map((item, index) => (
                <p key={item} className="flex justify-between border-b border-[#eef2ef] pb-2"><span>{item}</span><strong>{formatKrw([18500, 25600, 34200, 12000][index])}</strong></p>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#e1e9e4] p-5">
            <h3 className="text-lg font-black text-[#172033]">점주 피드백</h3>
            <p className="mt-4 rounded-2xl bg-[#f8fbf9] p-4 text-sm font-bold leading-6 text-[#5d6876]">브랜치 덕분에 식자재 가격 변동을 미리 알고 대응할 수 있어 도움이 됐어요.</p>
            <button type="button" className="mt-4 w-full rounded-xl border border-[#0f7b54] px-4 py-3 text-sm font-black text-[#0f7b54]">피드백 남기기</button>
          </section>
        </div>

        <p className="mt-5 rounded-2xl bg-[#e7f4ed] p-4 text-center text-sm font-black text-[#0f7b54]">대시보드는 오픈 후 즉시 이용 가능하며, 3개월간 모든 기능을 무료로 이용할 수 있습니다.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <button type="button" className="rounded-2xl border border-[#172033] bg-white px-6 py-4 text-sm font-black text-[#172033]"><Download className="mr-2 inline" size={16} /> 리포트 저장하기</button>
          <button type="button" onClick={() => setShowInterestForm((current) => !current)} className="rounded-2xl bg-[#0f7b54] px-6 py-4 text-sm font-black text-white">상담사 입점 시 연락받기</button>
          <Link href="/dashboard/startup/owner-conversion" className="rounded-2xl bg-[#172033] px-6 py-4 text-center text-sm font-black text-white">점주 대시보드 미리보기 →</Link>
        </div>
        {showInterestForm ? (
          <div id="owner-waitlist" className="mt-5">
            <InlineWaitlistCta
              title="상담 오픈과 점주 대시보드 혜택을 먼저 받아보세요"
              description="상담사 입점이 시작되면 우선 예약 링크와 점주 대시보드 3개월 무료 안내를 먼저 보내드립니다."
              purpose="owner_preview_waitlist"
              submitLabel="우선 연락 신청"
              benefits={["상담 오픈 시 우선 예약 링크", "점주 대시보드 3개월 무료 안내", "운영 리포트 저장 기능 안내"]}
              defaultBenefit="상담 오픈 시 우선 예약 링크"
              category={simulation.category.display_name}
              testId="owner-waitlist"
            />
          </div>
        ) : null}
      </section>

      <OwnerDashboardPreview simulation={getRealProfitSimulationsOrFallback()} readiness={getRealReadiness()} infra={infra} />
    </div>
  );
}

function OwnerCard({ icon, title, desc, value }: { icon: React.ReactNode; title: string; desc: string; value: string }) {
  return (
    <article className="rounded-2xl border border-[#e1e9e4] p-5">
      <div className="flex items-center justify-between">
        <span className="text-[#0f7b54]">{icon}</span>
        <span className="rounded-full bg-[#eef7f1] px-3 py-1 text-xs font-black text-[#0f7b54]">{value}</span>
      </div>
      <h3 className="mt-4 font-black text-[#172033]">{title}</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-[#5d6876]">{desc}</p>
    </article>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone: "green" | "red" }) {
  return <div className="rounded-2xl border border-[#e1e9e4] p-4"><p className="text-sm font-bold text-[#5d6876]">{label}</p><p className={`mt-2 text-xl font-black ${tone === "green" ? "text-[#0f7b54]" : "text-[#e14d3d]"}`}>{value}</p></div>;
}
