"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/branch/Common";
import { calculateFinanceSimulation } from "@/lib/branch/finance/finance-calculator";
import { formatManwon } from "@/lib/branch/finance/finance-format";
import { getBrandById, getDefaultBrand } from "@/lib/branch/data";
import { getOwnerConversionDemo, resolveOpeningTargetDate } from "@/lib/branch/user-input";
import { getBranchStorage } from "@/lib/branch/storage";
import { readStartupInput, saveOwnerConversion } from "@/lib/branch/storage/startup-flow-storage";
import { generateTimetable } from "@/lib/branch/timetable/generate-timetable";

export default function OwnerConversionPage() {
  const router = useRouter();
  const [brandId, setBrandId] = useState(getDefaultBrand().id);
  const input = readStartupInput();
  const brand = getBrandById(brandId);
  const finance = calculateFinanceSimulation(input).scenarios.base;
  const timetable = generateTimetable(input.opening_target);
  const conversion = getOwnerConversionDemo();

  useEffect(() => {
    getBranchStorage().getSelectedBrand().then(setBrandId);
  }, []);

  function convert() {
    saveOwnerConversion({ accountStage: "owner_demo", updatedAt: new Date().toISOString() });
    router.push("/dashboard/startup/owner-preview");
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        title="점주 전환 미리보기"
        subtitle="브랜드 선택, 4개월 회계, 타임테이블, RFP 생성 이후 점주 대시보드로 넘어가는 데모입니다."
        warning="실제 점주 계정 전환이 아니라 owner_demo 상태를 저장하는 체험 흐름입니다."
      />
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Metric label="선택 브랜드" value={brand.name} />
          <Metric label="개점 목표일" value={resolveOpeningTargetDate(input.opening_target)} />
          <Metric label="4개월 후 현금잔고" value={formatManwon(finance.endingCashMonth4)} />
          <Metric label="남은 준비 태스크" value={`${timetable.tasks.length}개`} />
        </div>
      </section>
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <h3 className="text-lg font-black text-[#164033]">점주 전환 시 제공 기능</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {conversion.owner_demo_features.map((feature) => (
            <div key={feature} className="rounded-lg bg-[#f6f1e8] p-3 text-sm font-black text-[#164033]">{feature}</div>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-[#fff0cf] p-3 text-sm font-black text-[#805412]">점주 대시보드 {conversion.free_trial_months}개월 무료 표시</p>
      </section>
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <h3 className="text-lg font-black text-[#164033]">상담 신청 상태</h3>
        <p className="mt-2 text-sm font-bold text-[#655d52]">RFP 생성 또는 상담신청 후 점주 전환 데모를 실행할 수 있습니다. 현재는 데모 상태로 즉시 전환합니다.</p>
      </section>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={convert} className="rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">점주 계정으로 전환 데모</button>
        <Link href="/dashboard/startup/owner-preview" className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">점주 대시보드 미리보기</Link>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f6f1e8] p-3"><p className="text-xs font-bold text-[#7a7065]">{label}</p><p className="mt-1 font-black text-[#164033]">{value}</p></div>;
}
