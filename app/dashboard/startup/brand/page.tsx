"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { BrandSummaryPanel } from "@/components/branch/BrandSummaryPanel";
import { BusinessBlueprintCard, CategoryChips, RegenerateButton, useDemoExperience } from "@/components/branch/DemoExperience";
import { getDefaultBrand } from "@/lib/branch/data";

export default function BrandPage() {
  const { input, simulation, patchInput } = useDemoExperience();
  const brand = getDefaultBrand();

  return (
    <div className="grid gap-8">
      <header className="rounded-[28px] border border-[#eadfce] bg-[#fffaf3] p-6 shadow-[0_18px_50px_rgba(61,45,27,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-[#eadfce] px-4 py-2 text-sm font-black text-[#4a2a18]">STEP 02</span>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.03em] text-[#2b1e16]">업종을 선택하면, AI가 브랜드 콘셉트를 바로 보여드려요</h2>
            <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-[#6a6258]">선택한 업종을 기반으로 상호명, 콘셉트, 공간, 메뉴, 패키지까지 하나의 브랜드로 제안합니다.</p>
          </div>
          <div className="rounded-3xl border border-[#eadfce] bg-white p-5">
            <p className="flex items-center gap-2 text-base font-black text-[#2b1e16]"><Sparkles size={18} /> AI 브랜드 컨셉 생성</p>
            <p className="mt-2 max-w-sm text-sm font-bold leading-6 text-[#7b6a59]">공정위·메뉴경제성·입지 캐시 데이터를 조합해 완성도 높은 체험용 창업안을 구성합니다.</p>
          </div>
        </div>
        <div className="mt-8">
          <CategoryChips selected={simulation.category.display_name} onSelect={(category) => patchInput({ category })} />
        </div>
      </header>

      <section className="grid gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-[#2b1e16]">{simulation.category.display_name} 브랜드 콘셉트 미리보기</h3>
            <p className="mt-1 text-sm font-bold text-[#7b6a59]">고기덮밥 샘플 화면을 업종별 템플릿 구조로 확장했습니다.</p>
          </div>
          <RegenerateButton onClick={() => patchInput({ category: input.category })} />
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {simulation.imageTemplates.slice(0, 4).map((template, index) => (
            <article key={template.template_id} className="overflow-hidden rounded-[24px] border border-[#eadfce] bg-white shadow-[0_14px_32px_rgba(61,45,27,0.06)]">
              <img src={template.image_path} alt={template.visual_concept} className="h-72 w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-black text-[#0f7b54]">{["외관 디자인", "실내 인테리어", "대표 메뉴", "패키지 디자인"][index] ?? "브랜드 이미지"}</p>
                <h4 className="mt-2 text-lg font-black text-[#2b1e16]">{template.hero_menu_visual}</h4>
                <p className="mt-2 text-sm font-bold leading-6 text-[#7b6a59]">{template.signage_style} · {template.interior_tone}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <BusinessBlueprintCard input={input} simulation={simulation} />

      <section className="rounded-[28px] border border-[#eadfce] bg-white p-6">
        <h3 className="text-xl font-black text-[#2b1e16]">AI가 완성하는 통합 브랜드 콘셉트</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {["상호명", "브랜드 스토리", "인테리어", "메뉴", "패키지", "톤앤매너", "개점 로드맵"].map((item) => (
            <span key={item} className="rounded-full border border-[#eadfce] bg-[#fffaf3] px-4 py-2 text-sm font-black text-[#6b5c4d]">{item}</span>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <p className="rounded-2xl bg-[#f3faf6] p-4 text-sm font-bold text-[#406150]"><CheckCircle2 className="mb-2 text-[#0f7b54]" /> 업종 평균 매출과 창업비용을 청사진에 반영</p>
          <p className="rounded-2xl bg-[#f3faf6] p-4 text-sm font-bold text-[#406150]"><CheckCircle2 className="mb-2 text-[#0f7b54]" /> 메뉴·원가·공급처 데이터와 다음 화면에서 연결</p>
          <p className="rounded-2xl bg-[#f3faf6] p-4 text-sm font-bold text-[#406150]"><CheckCircle2 className="mb-2 text-[#0f7b54]" /> 개점일 기준 타임테이블 자동 생성</p>
        </div>
      </section>

      <BrandSummaryPanel brand={brand} operatingType={input.operation_type} />

      <div className="flex flex-wrap justify-end gap-3">
        <Link href="/dashboard/startup/input" className="rounded-2xl border border-[#e4dacb] bg-white px-5 py-4 text-sm font-black text-[#4a2a18]">조건 수정</Link>
        <Link href="/dashboard/startup/timetable" className="inline-flex items-center gap-2 rounded-2xl bg-[#073d2d] px-6 py-4 text-sm font-black text-white">
          이 콘셉트로 타임테이블 생성 <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
