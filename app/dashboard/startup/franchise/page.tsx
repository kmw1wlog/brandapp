"use client";

import Link from "next/link";
import { Download, SlidersHorizontal } from "lucide-react";
import { formatKrw, useDemoExperience } from "@/components/branch/DemoExperience";
import { InlineWaitlistCta } from "@/components/branch/InlineWaitlistCta";
import { getRealFranchiseBrands } from "@/lib/branch/real-data";
import { formatRange } from "@/lib/branch/format";

const rows = [
  ["초기 자본", "startup"],
  ["준비 기간", "period"],
  ["예상 월매출 (4개월차)", "sales"],
  ["점주 순이익 (4개월차)", "profit"],
  ["가맹비", "fee"],
  ["교육비", "education"],
  ["로열티", "royalty"],
  ["공급처 자유도", "supplier"],
  ["브랜드 자유도", "brand"],
  ["본사 지원", "support"]
];

export default function FranchisePage() {
  const { input, simulation } = useDemoExperience();
  const brands = getRealFranchiseBrands().slice(0, 8);
  const franchiseStartup = simulation.benchmark.startup_cost_krw.median ?? input.budget + 20_000_000;
  const ownSales = simulation.results.monthlySales;
  const franchiseSales = Math.round(ownSales * 1.1);
  const ownProfit = simulation.results.estimatedOwnerProfit;
  const franchiseProfit = Math.round(ownProfit * 0.88);

  const values: Record<string, [string, string]> = {
    startup: [formatKrw(Math.min(input.budget, franchiseStartup * 0.72)), formatKrw(franchiseStartup)],
    period: ["45일", "30일"],
    sales: [formatKrw(ownSales), formatKrw(franchiseSales)],
    profit: [`${formatKrw(ownProfit)} (${Math.round((ownProfit / ownSales) * 100)}%)`, `${formatKrw(franchiseProfit)} (${Math.round((franchiseProfit / franchiseSales) * 100)}%)`],
    fee: ["0원", "1,000만원 내외"],
    education: ["0원", "150만원 내외"],
    royalty: ["0%", "매출 3~5%"],
    supplier: ["높음", "낮음"],
    brand: ["높음", "낮음"],
    support: ["제한적", "높음"]
  };

  return (
    <div className="grid gap-6">
      <header className="rounded-[28px] border border-[#d7e7df] bg-white p-6 shadow-[0_18px_50px_rgba(31,53,42,0.07)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#0f7b54]">브랜드 비교 · 내 브랜드 vs 프랜차이즈</p>
            <h2 className="mt-3 text-4xl font-black text-[#172033]">내 브랜드 vs 프랜차이즈 비교 & 1~4개월 시뮬레이션</h2>
            <p className="mt-2 text-sm font-bold text-[#5d6876]">초기 투자부터 수익성까지 두 선택지를 같은 조건으로 비교합니다.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/startup/input" className="inline-flex items-center gap-2 rounded-xl border border-[#d7e7df] px-4 py-3 text-sm font-black text-[#0f5d43]"><SlidersHorizontal size={16} /> 조건 수정</Link>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#0f7b54] px-4 py-3 text-sm font-black text-white"><Download size={16} /> PDF 다운로드</button>
          </div>
        </div>
      </header>

      <section className="rounded-[28px] border border-[#d7e7df] bg-white p-6 shadow-[0_18px_50px_rgba(31,53,42,0.07)]">
        <div className="overflow-hidden rounded-2xl border border-[#e1e9e4]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#f8fbf9]">
                <th className="w-1/5 p-4 text-center font-black text-[#172033]">항목</th>
                <th className="p-4 text-center text-xl font-black text-[#0f7b54]">내 브랜드</th>
                <th className="p-4 text-center text-xl font-black text-[#0f5d9c]">프랜차이즈</th>
              </tr>
            </thead>
            <tbody className="font-bold text-[#26313f]">
              {rows.map(([label, key]) => (
                <tr key={key} className="border-t border-[#e1e9e4]">
                  <td className="bg-[#fbfcfb] p-4 font-black">{label}</td>
                  <td className={`p-4 text-center ${["profit", "supplier", "brand"].includes(key) ? "font-black text-[#0f7b54]" : ""}`}>{values[key][0]}</td>
                  <td className={`p-4 text-center ${["supplier", "brand"].includes(key) ? "font-black text-[#e14d3d]" : key === "support" ? "font-black text-[#0f7b54]" : ""}`}>{values[key][1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="월별 예상 매출 추이" own={[0.45, 0.66, 0.86, 1]} franchise={[0.58, 0.82, 0.95, 1.1]} unit="만원" base={ownSales / 10_000} />
        <ChartCard title="월별 점주 순이익 추이" own={[0.3, 0.55, 0.78, 1]} franchise={[0.42, 0.64, 0.79, 0.88]} unit="만원" base={ownProfit / 10_000} />
      </section>

      <p className="rounded-2xl border border-[#f1dfb9] bg-[#fff8e8] p-4 text-sm font-bold leading-6 text-[#7d5a1d]">
        본 시뮬레이션은 입력한 가정과 시장 데이터를 기반으로 산출된 예측치입니다. 프랜차이즈가 항상 불리한 것은 아니며, 업종과 점주의 경험에 따라 더 나은 선택일 수 있습니다.
      </p>

      <InlineWaitlistCta
        title="비교 결과를 저장하고 더 구체적인 비교안을 받아보세요"
        description="업종별 직접 비교군이 늘어나거나 PDF 저장 기능이 열리면 가장 먼저 알려드립니다."
        purpose="franchise_compare_waitlist"
        submitLabel="비교 결과 업데이트 받기"
        benefits={["내 브랜드 vs 프랜차이즈 PDF", "동종 브랜드 비교 업데이트", "상담 전 체크리스트 받기"]}
        defaultBenefit="내 브랜드 vs 프랜차이즈 PDF"
        category={simulation.category.display_name}
        testId="franchise-waitlist"
      />

      <details className="rounded-[28px] border border-[#d7e7df] bg-white p-6">
        <summary className="cursor-pointer text-xl font-black text-[#172033]">수집된 프랜차이즈 브랜드 상세 보기</summary>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {brands.map((brand) => (
            <article key={brand.id} className="rounded-2xl border border-[#e1e9e4] p-4">
              <h3 className="text-xl font-black text-[#172033]">{brand.name}</h3>
              <p className="mt-2 text-sm font-bold text-[#5d6876]">{brand.mainMenu?.join(", ") || "대표 메뉴 추가 수집 예정"}</p>
              <div className="mt-4 grid gap-2 text-sm">
                <Mini label="월평균 매출" value={brand.monthlyAverageSalesText ?? formatKrw(brand.monthlyAverageSales ?? 0)} />
                <Mini label="창업비용" value={formatRange(brand.startupCostMin, brand.startupCostMax)} />
                <Mini label="가맹점 수" value={brand.franchiseStoreCount?.toLocaleString("ko-KR") ?? "확인 필요"} />
              </div>
            </article>
          ))}
        </div>
      </details>

      <div className="flex justify-end">
        <Link href="/dashboard/startup/owner-preview" className="rounded-2xl bg-[#073d2d] px-6 py-4 text-sm font-black text-white">점주 대시보드 미리보기</Link>
      </div>
    </div>
  );
}

function ChartCard({ title, own, franchise, base, unit }: { title: string; own: number[]; franchise: number[]; base: number; unit: string }) {
  return (
    <article className="rounded-[28px] border border-[#d7e7df] bg-white p-6 shadow-[0_18px_50px_rgba(31,53,42,0.07)]">
      <h3 className="text-xl font-black text-[#172033]">{title}</h3>
      <div className="mt-5 grid gap-4">
        {["1개월차", "2개월차", "3개월차", "4개월차"].map((month, index) => (
          <div key={month} className="grid grid-cols-[72px_1fr_80px] items-center gap-3 text-sm font-bold">
            <span>{month}</span>
            <div className="grid gap-2">
              <Bar value={own[index]} color="#0f7b54" />
              <Bar value={franchise[index]} color="#2878d9" />
            </div>
            <span className="text-right">{Math.round(base * own[index]).toLocaleString("ko-KR")}{unit}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-4 text-xs font-black"><span className="text-[#0f7b54]">내 브랜드</span><span className="text-[#2878d9]">프랜차이즈</span></div>
    </article>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return <div className="h-3 overflow-hidden rounded-full bg-[#edf1ec]"><div className="h-full rounded-full" style={{ width: `${Math.min(100, value * 86)}%`, background: color }} /></div>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return <p className="flex justify-between gap-3 rounded-xl bg-[#f8fbf9] p-3"><span className="text-[#5d6876]">{label}</span><strong>{value}</strong></p>;
}
