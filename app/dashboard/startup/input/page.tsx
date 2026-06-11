"use client";

import Link from "next/link";
import { CalendarDays, ChevronDown, Info, MapPin, Settings, Store, Wallet } from "lucide-react";
import type React from "react";
import { BrandConceptPreview, CategoryChips, formatManwon, useDemoExperience } from "@/components/branch/DemoExperience";
import { getExperienceCategories } from "@/lib/branch/experience-data";
import { getRegionProfiles } from "@/lib/branch/user-input";
import type { OpeningTarget } from "@/lib/branch/finance/finance-types";

const budgetOptions = [
  { label: "3,000만원 미만", value: 30_000_000 },
  { label: "5,000만원", value: 50_000_000 },
  { label: "7,000만원 ~ 1억원 미만", value: 80_000_000 },
  { label: "1억원 이상", value: 120_000_000 }
];

const operationTypes = ["점포+배달 혼합형", "점포형", "배달형", "포장 전문형"];

export default function StartupInputPage() {
  const { input, simulation, patchInput } = useDemoExperience();
  const regions = getRegionProfiles().slice(0, 6);

  function setOpeningTarget(target: OpeningTarget) {
    patchInput({ opening_target: target });
  }

  return (
    <div className="grid gap-8">
      <header className="rounded-[28px] border border-[#eadfce] bg-white px-6 py-5 shadow-[0_18px_50px_rgba(61,45,27,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#0f7b54]">창업안 생성</p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.03em] text-[#171717]">당신의 브랜드 창업안을 생성합니다</h2>
            <p className="mt-2 text-sm font-bold text-[#6a6258]">몇 가지 정보를 입력하면 시장에 최적화된 브랜드 창업안을 제안합니다.</p>
          </div>
          <div className="hidden items-center gap-3 text-sm font-black text-[#7b6a59] lg:flex">
            <span className="rounded-full border border-[#e4dacb] px-4 py-2">1 서비스 소개</span>
            <span className="rounded-full border border-[#e4dacb] px-4 py-2">2 시장/상권 분석</span>
            <span className="rounded-full border border-[#e4dacb] px-4 py-2">3 인사이트</span>
            <span className="rounded-full bg-[#073d2d] px-4 py-2 text-white">4 창업안 생성</span>
          </div>
        </div>
      </header>

      <section className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[28px] border border-[#e4dacb] bg-white p-6 shadow-[0_20px_60px_rgba(61,45,27,0.07)]">
          <div className="grid gap-4">
            <FieldRow icon={<MapPin size={22} />} label="창업 지역">
              <div className="grid gap-3 sm:grid-cols-3">
                <Select value={input.region} onChange={(value) => patchInput({ region: value })} options={regions.map((region) => region.display_name)} />
                <Select value="구/군 선택" onChange={() => undefined} options={["구/군 선택", "마포구", "수성구", "연제구"]} />
                <Select value="상권 선택" onChange={() => undefined} options={["상권 선택", "홍대입구역 인근", "대학가 인근", "반월당역 인근"]} />
              </div>
            </FieldRow>

            <FieldRow icon={<Wallet size={22} />} label="창업 자본">
              <Select value={formatManwon(input.budget)} onChange={(label) => patchInput({ budget: budgetOptions.find((item) => item.label === label)?.value ?? input.budget })} options={budgetOptions.map((item) => item.label)} />
            </FieldRow>

            <FieldRow icon={<Store size={22} />} label="업종">
              <CategoryChips selected={simulation.category.display_name} onSelect={(category) => patchInput({ category })} />
              <Select value={simulation.category.display_name} onChange={(category) => patchInput({ category })} options={getExperienceCategories().map((category) => category.display_name)} />
            </FieldRow>

            <FieldRow icon={<Store size={22} />} label="운영 형태">
              <Select value={input.operation_type} onChange={(operation_type) => patchInput({ operation_type })} options={operationTypes} />
            </FieldRow>

            <FieldRow icon={<CalendarDays size={22} />} label="목표 개점일">
              <div className="grid gap-3 sm:grid-cols-3">
                <button type="button" onClick={() => setOpeningTarget({ type: "days_from_now", days: 30 })} className="rounded-xl border border-[#e4dacb] px-4 py-3 text-sm font-black text-[#4a2a18]">30일</button>
                <button type="button" onClick={() => setOpeningTarget({ type: "days_from_now", days: 45 })} className="rounded-xl bg-[#073d2d] px-4 py-3 text-sm font-black text-white">45일</button>
                <input type="date" onChange={(event) => setOpeningTarget({ type: "date", date: event.target.value })} className="rounded-xl border border-[#e4dacb] px-4 py-3 text-sm font-black text-[#4a2a18]" />
              </div>
            </FieldRow>

            <button type="button" className="flex items-center justify-between rounded-2xl border border-[#e4dacb] bg-[#fffaf3] px-5 py-4 text-left" aria-expanded="false">
              <span>
                <span className="flex items-center gap-2 text-base font-black text-[#2b1e16]"><Settings size={19} /> 고급 설정 선택</span>
                <span className="mt-1 block text-sm font-bold text-[#7b6a59]">타깃 고객, 객단가, 매장 규모 등 세부 조건은 다음 단계에서 조정합니다.</span>
              </span>
              <ChevronDown size={18} />
            </button>

            <Link
              href="/dashboard/startup/brand"
              className="rounded-2xl bg-[#073d2d] px-6 py-5 text-center text-lg font-black text-white shadow-[0_18px_34px_rgba(7,61,45,0.18)]"
            >
              내 브랜드 창업안 생성하기
              <span className="mt-1 block text-sm font-bold text-white/78">약 30초 소요</span>
            </Link>

            <p className="flex items-center justify-center gap-2 text-xs font-bold text-[#8a7b6c]">
              <Info size={15} /> 입력 정보는 브라우저에 저장되며 체험용 데모에서만 사용됩니다.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <BrandConceptPreview simulation={simulation} />
          <section className="rounded-[28px] border border-[#e4dacb] bg-white p-5">
            <h3 className="text-lg font-black text-[#2b1e16]">창업안 하이라이트</h3>
            <div className="mt-4 grid gap-3 text-sm font-bold text-[#6a6258]">
              <p className="rounded-xl bg-[#f3faf6] p-4">✓ {input.region}의 반경 1km 수요와 업종 밀도를 창업안에 반영합니다.</p>
              <p className="rounded-xl bg-[#f3faf6] p-4">✓ {simulation.category.display_name} 평균 객단가와 원가율로 메뉴/가격을 설계합니다.</p>
              <p className="rounded-xl bg-[#f3faf6] p-4">✓ 초기 투자비 대비 회수 가능한 수익 모델을 다음 단계에서 계산합니다.</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function FieldRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-[#f0e7d9] pb-4 last:border-0">
      <div className="flex items-center gap-3 text-lg font-black text-[#2b1e16]">
        <span className="text-[#0f7b54]">{icon}</span>
        {label}
      </div>
      {children}
    </div>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-[#e4dacb] bg-white px-4 py-3 text-sm font-black text-[#2b1e16]">
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}
