"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, RefreshCw, Sparkles, Store, WalletCards } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { buildExperienceSimulation, getExperienceCategories, type ExperienceSimulation } from "@/lib/branch/experience-data";
import { defaultStartupInput, normalizeStartupInput } from "@/lib/branch/user-input";
import { readStartupInput, saveStartupInput } from "@/lib/branch/storage/startup-flow-storage";
import type { StartupUserInput } from "@/lib/branch/finance/finance-types";

export function useDemoExperience() {
  const [input, setInput] = useState<StartupUserInput>(defaultStartupInput);

  useEffect(() => {
    setInput(readStartupInput());
  }, []);

  const simulation = useMemo(() => buildExperienceSimulation(input), [input]);

  function patchInput(patch: Partial<StartupUserInput>) {
    const next = normalizeStartupInput({ ...input, ...patch });
    setInput(next);
    saveStartupInput(next);
  }

  return { input, simulation, patchInput };
}

export function formatKrw(value: number) {
  return new Intl.NumberFormat("ko-KR").format(Math.round(value)) + "원";
}

export function formatManwon(value: number) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(value / 10_000))}만원`;
}

export function categoryIcon(label: string) {
  if (label.includes("커피") || label.includes("음료")) return "☕";
  if (label.includes("디저트") || label.includes("베이커리")) return "🍰";
  if (label.includes("샐러드") || label.includes("포케")) return "🥗";
  if (label.includes("치킨") || label.includes("분식")) return "🍗";
  if (label.includes("버거") || label.includes("샌드")) return "🍔";
  if (label.includes("중식")) return "🥢";
  if (label.includes("일식")) return "🍜";
  if (label.includes("도시락")) return "🍱";
  return "🍚";
}

export function CategoryChips({ selected, onSelect }: { selected: string; onSelect: (displayName: string) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {getExperienceCategories().slice(0, 11).map((category) => {
        const active = category.display_name === selected;
        return (
          <button
            key={category.category_id}
            type="button"
            onClick={() => onSelect(category.display_name)}
            className={`flex min-w-max items-center gap-2 rounded-full border px-5 py-3 text-sm font-black transition ${
              active ? "border-[#4a2a18] bg-[#4a2a18] text-white" : "border-[#e6ded2] bg-white text-[#6b5c4d] hover:border-[#b58b6c]"
            }`}
          >
            <span>{categoryIcon(category.display_name)}</span>
            {category.display_name}
          </button>
        );
      })}
    </div>
  );
}

export function ConceptImage({ src, alt, label, className = "" }: { src: string; alt: string; label?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#efe8dd] ${className}`}>
      <img src={src} alt={alt} className="h-full min-h-[180px] w-full object-cover" />
      {label ? <span className="absolute left-3 top-3 rounded-full bg-[#073d2d] px-3 py-1 text-xs font-black text-white">{label}</span> : null}
    </div>
  );
}

export function BrandConceptPreview({ simulation, compact = false }: { simulation: ExperienceSimulation; compact?: boolean }) {
  const templates = simulation.imageTemplates.slice(0, 4);
  const primary = templates[0]?.image_path ?? "/branch/image_template/categories/rice_bowl/rice_bowl_01.jpg";
  const secondary = templates[1]?.image_path ?? primary;
  const third = templates[2]?.image_path ?? primary;
  const fourth = templates[3]?.image_path ?? primary;
  const firstMenu = simulation.menus[0];

  return (
    <section className="rounded-[28px] border border-[#e4dacb] bg-white p-5 shadow-[0_20px_60px_rgba(61,45,27,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#0f7b54]">예상 브랜드 콘셉트 미리보기</p>
          <h3 className="mt-2 text-3xl font-black text-[#2f2219]">{simulation.virtualBrand.name}</h3>
          <p className="mt-1 font-bold text-[#7b6a59]">{simulation.virtualBrand.tagline}</p>
        </div>
        <span className="rounded-full bg-[#e7f4ed] px-3 py-2 text-xs font-black text-[#0f7b54]">실시간 업데이트</span>
      </div>
      <div className={`mt-5 grid gap-3 ${compact ? "md:grid-cols-2" : "lg:grid-cols-[1.1fr_0.9fr]"}`}>
        <ConceptImage src={primary} alt={`${simulation.virtualBrand.name} 대표 메뉴`} label="대표 메뉴" className="min-h-[260px]" />
        <div className="grid gap-3 sm:grid-cols-2">
          <ConceptImage src={secondary} alt="브랜드 외관" label="브랜드 외관" />
          <ConceptImage src={third} alt="매장 인테리어" label="매장 인테리어" />
          <ConceptImage src={fourth} alt="패키지" label="패키지" />
          <div className="rounded-2xl border border-[#eadfce] bg-[#fffaf3] p-5">
            <p className="text-sm font-black text-[#4a2a18]">대표 메뉴</p>
            <p className="mt-4 text-xl font-black text-[#171717]">{firstMenu?.menu_name ?? simulation.category.representative_menu_groups[0]}</p>
            <p className="mt-2 text-sm font-bold text-[#7b6a59]">
              권장 판매가 {firstMenu ? formatKrw(firstMenu.recommended_price_band_krw[0]) : formatKrw(simulation.results.averageOrderValue)}
            </p>
          </div>
        </div>
      </div>
      {!compact ? (
        <div className="mt-5 grid gap-3 rounded-2xl border border-[#eadfce] bg-[#fffaf3] p-4 text-sm font-bold text-[#5f5348] md:grid-cols-3">
          <p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#0f7b54]" /> {simulation.category.display_name} 평균매출과 입지 지표 반영</p>
          <p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#0f7b54]" /> 배달 적합도 {simulation.category.delivery_fit}</p>
          <p className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#0f7b54]" /> 메뉴·원가·공급처 화면과 연결</p>
        </div>
      ) : null}
    </section>
  );
}

export function BusinessBlueprintCard({ input, simulation }: { input: StartupUserInput; simulation: ExperienceSimulation }) {
  const openingDays = input.opening_target.type === "days_from_now" ? input.opening_target.days ?? 45 : 45;
  const startupCost = Math.min(input.budget, simulation.benchmark.startup_cost_krw.median ?? input.budget);
  const primary = simulation.imageTemplates[0]?.image_path ?? "/branch/image_template/categories/rice_bowl/rice_bowl_01.jpg";
  const secondary = simulation.imageTemplates[1]?.image_path ?? primary;
  const third = simulation.imageTemplates[2]?.image_path ?? primary;
  const fourth = simulation.imageTemplates[3]?.image_path ?? primary;

  return (
    <section className="rounded-[28px] border border-[#e4dacb] bg-white p-5 shadow-[0_18px_50px_rgba(61,45,27,0.08)]">
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-3xl bg-[#fffaf3] p-6">
          <p className="text-sm font-black text-[#0f7b54]">청사진 미리보기</p>
          <h3 className="mt-5 text-4xl font-black text-[#2b1e16]">{simulation.virtualBrand.name}</h3>
          <p className="mt-3 text-lg font-bold text-[#6b5c4d]">{simulation.virtualBrand.tagline}</p>
          <dl className="mt-8 grid gap-4 text-sm">
            <Metric icon={<Store size={18} />} label="예상 창업 비용" value={formatKrw(startupCost)} />
            <Metric icon={<WalletCards size={18} />} label="예상 월 매출" value={formatKrw(simulation.results.monthlySales)} />
            <Metric icon={<Sparkles size={18} />} label="예상 점주 수익" value={formatKrw(simulation.results.estimatedOwnerProfit)} />
            <Metric icon={<CalendarDays size={18} />} label="오픈 예상 일정" value={`${openingDays}일`} />
          </dl>
          <p className="mt-8 text-xs font-bold leading-6 text-[#8a7b6c]">이 수치는 입력 조건과 공개 데이터 기반 예측이며 실제 결과와 차이가 있을 수 있습니다.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ConceptImage src={secondary} alt="매장 외관" label="매장 외관" className="min-h-[260px]" />
          <ConceptImage src={third} alt="매장 인테리어" label="매장 인테리어" className="min-h-[260px]" />
          <ConceptImage src={primary} alt="대표 메뉴" label="대표 메뉴" className="min-h-[260px]" />
          <ConceptImage src={fourth} alt="배달 패키지" label="배달 패키지" className="min-h-[260px]" />
        </div>
      </div>
    </section>
  );
}

export function StartupPlanHero() {
  const { input, simulation, patchInput } = useDemoExperience();
  const categories = getExperienceCategories().slice(0, 5);

  return (
    <section className="overflow-hidden rounded-[34px] border border-[#eadfce] bg-[#fffaf3] p-6 shadow-[0_24px_70px_rgba(61,45,27,0.08)] lg:p-10">
      <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex flex-col justify-center">
          <p className="inline-flex w-max items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#4a2a18] shadow-sm">
            <Sparkles size={16} /> 프랜차이즈 상담 전, 내 계획을 비교해보세요
          </p>
          <h2 className="mt-8 text-5xl font-black leading-[1.15] text-[#2b1e16]">
            내 창업 계획이
            <br />
            더 나은 선택일 수 있어요
          </h2>
          <p className="mt-6 max-w-xl text-lg font-bold leading-8 text-[#6b5c4d]">
            지역, 예산, 업종, 준비기간만 입력하면 나에게 맞는 1인 브랜드 창업 플랜을 무료로 비교합니다.
          </p>
          <div className="mt-8 grid gap-3 rounded-2xl border border-[#eadfce] bg-white p-4 sm:grid-cols-4">
            <SelectBox label="희망 지역" value={input.region} options={["부산 대학가", "서울 마포구", "대구 반월당"]} onChange={(region) => patchInput({ region })} />
            <SelectBox label="창업 자본금" value={formatManwon(input.budget)} options={["3,000만원", "5,000만원", "8,000만원"]} onChange={(value) => patchInput({ budget: Number(value.replace(/[^0-9]/g, "")) * 10_000 })} />
            <SelectBox label="희망 업종" value={input.category} options={categories.map((category) => category.display_name)} onChange={(category) => patchInput({ category })} />
            <SelectBox label="준비 기간" value="3~6개월" options={["30일", "45일", "3~6개월"]} onChange={() => undefined} />
          </div>
          <Link href="/dashboard/startup/input" className="mt-4 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#4a2a18] px-6 py-5 text-lg font-black text-white">
            내 창업 플랜 비교하기 <ArrowRight size={20} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => {
            const preview = buildExperienceSimulation({ ...input, category: category.display_name });
            return (
              <button
                key={category.category_id}
                type="button"
                onClick={() => patchInput({ category: category.display_name })}
                className={`group relative overflow-hidden rounded-3xl text-left ${index === 0 ? "col-span-2" : ""}`}
              >
                <img src={preview.imageTemplates[0]?.image_path} alt={category.display_name} className="h-full min-h-[180px] w-full object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-black">{category.display_name}</p>
                  <h3 className="mt-1 text-2xl font-black">{preview.virtualBrand.name}</h3>
                  <p className="mt-1 text-sm font-bold text-white/86">{preview.virtualBrand.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SelectBox({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-xs font-black text-[#7b6a59]">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-[#eadfce] bg-white px-3 py-3 text-sm font-black text-[#2b1e16]">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function InfoPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
      <p className="flex items-center gap-2 text-xs font-black text-[#7b6a59]">{icon}{label}</p>
      <p className="mt-2 text-lg font-black text-[#2b1e16]">{value}</p>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#eadfce] pb-3">
      <dt className="flex items-center gap-2 font-bold text-[#6b5c4d]">{icon}{label}</dt>
      <dd className="font-black text-[#2b1e16]">{value}</dd>
    </div>
  );
}

export function InputConditionSummary({ input, simulation }: { input: StartupUserInput; simulation: ExperienceSimulation }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <InfoPill icon={<MapPin size={17} />} label="입지" value={input.region} />
      <InfoPill icon={<WalletCards size={17} />} label="자본" value={formatManwon(input.budget)} />
      <InfoPill icon={<Store size={17} />} label="업종" value={simulation.category.display_name} />
      <InfoPill icon={<CalendarDays size={17} />} label="운영형태" value={input.operation_type} />
    </div>
  );
}

export function RegenerateButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-xl border border-[#e6ded2] bg-white px-4 py-3 text-sm font-black text-[#4a2a18]">
      <RefreshCw size={16} /> 다른 콘셉트 보기
    </button>
  );
}
