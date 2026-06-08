"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/branch/Common";
import { getExperienceCategories } from "@/lib/branch/experience-data";
import { defaultStartupInput, getRegionProfiles, getUserInputSchema, normalizeStartupInput } from "@/lib/branch/user-input";
import { readStartupInput, saveStartupInput } from "@/lib/branch/storage/startup-flow-storage";
import type { OpeningTarget, StartupUserInput } from "@/lib/branch/finance/finance-types";
import { formatManwon } from "@/lib/branch/finance/finance-format";

const budgetOptions = [30_000_000, 50_000_000, 80_000_000];
const incomeOptions = [3_000_000, 5_000_000, 7_000_000];
const categories = getExperienceCategories().map((category) => category.display_name);
const operationTypes = ["점포형", "배달형", "점포+배달 혼합형"];
const ownerWorkingTypes = [
  { value: "full_time", label: "풀타임 근무" },
  { value: "peak_time", label: "피크타임만 근무" },
  { value: "staff_centered", label: "직원 중심 운영" }
];

export default function StartupInputPage() {
  const router = useRouter();
  const schema = getUserInputSchema();
  const [input, setInput] = useState<StartupUserInput>(defaultStartupInput);
  const [customBudget, setCustomBudget] = useState("");
  const [customRegion, setCustomRegion] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customIncome, setCustomIncome] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    setInput(readStartupInput());
  }, []);

  function patch(patchValue: Partial<StartupUserInput>) {
    setInput((current) => normalizeStartupInput({ ...current, ...patchValue }));
  }

  function setOpeningTarget(target: OpeningTarget) {
    patch({ opening_target: target });
  }

  function saveAndContinue() {
    const normalized = normalizeStartupInput(input);
    saveStartupInput(normalized);
    router.push("/dashboard/startup/new");
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        title="사용자 입력"
        subtitle="창업 예산과 개점 목표를 먼저 정해 브랜드 비교와 4개월 회계 시뮬레이션에 반영합니다."
        warning="실데이터, 공개정보 기반, 지역 추정값, 샘플 가정은 화면에서 구분해 표시합니다."
      />
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-[#164033]">필수 입력 8개</h3>
            <p className="mt-1 text-sm font-bold text-[#655d52]">{schema.required_inputs.length}개 항목 저장 · 새로고침 후 유지</p>
          </div>
          <span className="rounded-md bg-[#dff1e5] px-2 py-1 text-xs font-black text-[#164033]">저장 방식 localStorage</span>
        </div>
        <div className="mt-5 grid gap-5">
          <OptionGroup title="창업 예산" value={input.budget} options={budgetOptions.map((value) => ({ label: formatManwon(value), value }))} onSelect={(value) => patch({ budget: value, capital_structure: { own_capital: value, loan_amount: 0 } })} />
          <InlineNumber label="직접 입력 예산" value={customBudget} onChange={setCustomBudget} onApply={() => customBudget && patch({ budget: Number(customBudget), capital_structure: { ...input.capital_structure, own_capital: Number(customBudget) } })} />
          <div>
            <h4 className="font-black text-[#164033]">자기자본 / 대출</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => patch({ capital_structure: { own_capital: input.budget, loan_amount: 0 } })} className="rounded-lg border border-[#ddd2c0] px-3 py-2 text-sm font-black">전액 자기자본</button>
              <button type="button" onClick={() => patch({ capital_structure: { own_capital: Math.round(input.budget * 0.6), loan_amount: Math.round(input.budget * 0.4) } })} className="rounded-lg border border-[#ddd2c0] px-3 py-2 text-sm font-black">일부 대출</button>
              <button type="button" onClick={() => patch({ capital_structure: { own_capital: input.budget, loan_amount: 0 } })} className="rounded-lg border border-[#ddd2c0] px-3 py-2 text-sm font-black">아직 미정</button>
            </div>
            <p className="mt-2 text-sm font-bold text-[#655d52]">현재 {formatManwon(input.capital_structure.own_capital)} / 대출 {formatManwon(input.capital_structure.loan_amount)}</p>
          </div>
          <OptionGroup title="희망 지역" value={input.region} options={getRegionProfiles().map((profile) => ({ label: profile.display_name, value: profile.display_name }))} onSelect={(value) => patch({ region: value })} />
          <InlineText label="직접 입력 지역" value={customRegion} onChange={setCustomRegion} onApply={() => customRegion && patch({ region: customRegion })} />
          <OptionGroup title="희망 업종" value={input.category} options={categories.map((value) => ({ label: value, value }))} onSelect={(value) => patch({ category: value })} />
          <InlineText label="직접 입력 업종" value={customCategory} onChange={setCustomCategory} onApply={() => customCategory && patch({ category: customCategory })} />
          <OptionGroup title="운영 형태" value={input.operation_type} options={operationTypes.map((value) => ({ label: value, value }))} onSelect={(value) => patch({ operation_type: value })} />
          <div>
            <h4 className="font-black text-[#164033]">개점 목표</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setOpeningTarget({ type: "days_from_now", days: 14 })} className="rounded-lg border border-[#ddd2c0] px-3 py-2 text-sm font-black">2주 안</button>
              <button type="button" onClick={() => setOpeningTarget({ type: "days_from_now", days: 30 })} className="rounded-lg border border-[#ddd2c0] px-3 py-2 text-sm font-black">1개월 안</button>
              <button type="button" onClick={() => setOpeningTarget({ type: "days_from_now", days: 45 })} className="rounded-lg bg-[#164033] px-3 py-2 text-sm font-black text-white">45일 뒤</button>
              <button type="button" onClick={() => setOpeningTarget({ type: "months_from_now", months: 2 })} className="rounded-lg border border-[#ddd2c0] px-3 py-2 text-sm font-black">2개월 안</button>
              <button type="button" onClick={() => setOpeningTarget({ type: "unknown" })} className="rounded-lg border border-[#ddd2c0] px-3 py-2 text-sm font-black">아직 미정</button>
              <input type="date" onChange={(event) => setOpeningTarget({ type: "date", date: event.target.value })} className="rounded-lg border border-[#ddd2c0] px-3 py-2 text-sm font-bold" />
            </div>
          </div>
          <OptionGroup title="목표 월소득" value={input.target_owner_income} options={incomeOptions.map((value) => ({ label: formatManwon(value), value }))} onSelect={(value) => patch({ target_owner_income: value })} />
          <InlineNumber label="직접 입력 목표 월소득" value={customIncome} onChange={setCustomIncome} onApply={() => customIncome && patch({ target_owner_income: Number(customIncome) })} />
          <OptionGroup title="점주 직접 근무 형태" value={input.owner_working_type} options={ownerWorkingTypes} onSelect={(value) => patch({ owner_working_type: value })} />
        </div>
      </section>
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
        <button type="button" onClick={() => setAdvancedOpen((open) => !open)} className="font-black text-[#164033]">고급 입력 {advancedOpen ? "접기" : "펼치기"}</button>
        {advancedOpen ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <NumberField label="희망 평수" value={input.desired_size_pyeong ?? 15} onChange={(value) => patch({ desired_size_pyeong: value })} />
            <NumberField label="예상 보증금" value={input.expected_deposit ?? 0} onChange={(value) => patch({ expected_deposit: value })} />
            <NumberField label="예상 월세" value={input.expected_monthly_rent ?? 0} onChange={(value) => patch({ expected_monthly_rent: value })} />
            <NumberField label="권리금" value={input.key_money ?? 0} onChange={(value) => patch({ key_money: value })} />
            <NumberField label="인테리어 예산" value={input.interior_budget ?? 0} onChange={(value) => patch({ interior_budget: value })} />
            <NumberField label="주방설비 예산" value={input.equipment_budget ?? 0} onChange={(value) => patch({ equipment_budget: value })} />
            <NumberField label="배달 비중(0~0.9)" value={input.delivery_share ?? 0.45} step="0.05" onChange={(value) => patch({ delivery_share: value })} />
            <NumberField label="직원 수" value={input.staff_count ?? 1} onChange={(value) => patch({ staff_count: value })} />
            <NumberField label="마케팅 예산" value={input.marketing_budget ?? 0} onChange={(value) => patch({ marketing_budget: value })} />
          </div>
        ) : null}
      </section>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={saveAndContinue} className="rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">저장 후 비교 화면으로 이동</button>
        <button type="button" onClick={() => setInput(defaultStartupInput)} className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">기본값으로 시작</button>
      </div>
    </div>
  );
}

function OptionGroup<T extends string | number>({ title, value, options, onSelect }: { title: string; value: T; options: Array<{ label: string; value: T }>; onSelect: (value: T) => void }) {
  return (
    <div>
      <h4 className="font-black text-[#164033]">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={String(option.value)} type="button" onClick={() => onSelect(option.value)} className={`rounded-lg px-3 py-2 text-sm font-black ${value === option.value ? "bg-[#164033] text-white" : "border border-[#ddd2c0] bg-white text-[#574d42]"}`}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function InlineNumber({ label, value, onChange, onApply }: { label: string; value: string; onChange: (value: string) => void; onApply: () => void }) {
  return (
    <label className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#655d52]">
      {label}
      <input type="number" value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-[#ddd2c0] px-3 py-2" />
      <button type="button" onClick={onApply} className="rounded-lg border border-[#cbbda8] px-3 py-2 font-black text-[#574d42]">적용</button>
    </label>
  );
}

function InlineText({ label, value, onChange, onApply }: { label: string; value: string; onChange: (value: string) => void; onApply: () => void }) {
  return (
    <label className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#655d52]">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-[#ddd2c0] px-3 py-2" />
      <button type="button" onClick={onApply} className="rounded-lg border border-[#cbbda8] px-3 py-2 font-black text-[#574d42]">적용</button>
    </label>
  );
}

function NumberField({ label, value, step, onChange }: { label: string; value: number; step?: string; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-[#655d52]">
      {label}
      <input type="number" step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="rounded-lg border border-[#ddd2c0] px-3 py-2" />
    </label>
  );
}
