"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon, Sparkles, Store, Utensils } from "lucide-react";
import { buildExperienceSimulation, getExperienceCategories, type ExperienceSimulation } from "@/lib/branch/experience-data";
import { defaultStartupInput } from "@/lib/branch/user-input";
import { readStartupInput, saveStartupInput } from "@/lib/branch/storage/startup-flow-storage";
import type { StartupUserInput } from "@/lib/branch/finance/finance-types";
import { formatManwon, formatPercentValue, formatWon } from "@/lib/branch/finance/finance-format";

export function ExperienceSimulationPanel() {
  const [input, setInput] = useState<StartupUserInput>(defaultStartupInput);
  const [simulation, setSimulation] = useState<ExperienceSimulation>(() => buildExperienceSimulation(defaultStartupInput));
  const [message, setMessage] = useState("");
  const categories = getExperienceCategories();

  useEffect(() => {
    const saved = readStartupInput();
    setInput(saved);
    setSimulation(buildExperienceSimulation(saved));
  }, []);

  function selectCategory(displayName: string) {
    const next = { ...input, category: displayName };
    saveStartupInput(next);
    setInput(next);
    setSimulation(buildExperienceSimulation(next));
    setMessage("");
  }

  async function testKieTemplate(templateUrl: string) {
    setMessage("KIE 템플릿 확인 중");
    const response = await fetch("/api/branch/images/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandId: `experience_${simulation.category.category_id}`,
        brandName: simulation.virtualBrand.name,
        kind: "storefront",
        templateUrl
      })
    });
    const json = await response.json();
    setMessage(json.mock ? "KIE API 키 없음: 템플릿 이미지로 mock 생성 흐름 확인" : `KIE 작업 생성: ${json.taskId ?? json.status}`);
  }

  return (
    <section className="mb-6 rounded-lg border border-[#ddd2c0] bg-white p-5" data-testid="experience-simulation">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black text-[#b8642f]">FTC + SBIZ + KIE TEMPLATE</p>
          <h2 className="mt-1 text-2xl font-black text-[#164033]">업종 입력 기반 체험 시뮬레이션</h2>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-[#655d52]">
            현재 입력 업종은 {input.category}이며, {simulation.category.display_name} 데이터로 공정위 업종 평균과 입지 보정값을 연결했습니다.
          </p>
        </div>
        <div className="rounded-lg bg-[#f7f1e8] px-3 py-2 text-xs font-black text-[#574d42]">
          표본 {simulation.benchmark.sample_size}개 브랜드 · {simulation.benchmark.source_year}년
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category.category_id}
            type="button"
            onClick={() => selectCategory(category.display_name)}
            className={`min-w-max rounded-lg px-3 py-2 text-sm font-black ${
              simulation.category.category_id === category.category_id ? "bg-[#164033] text-white" : "border border-[#ddd2c0] text-[#574d42]"
            }`}
          >
            {category.display_name}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          <div className="rounded-lg border border-[#ddd2c0] p-4">
            <div className="flex items-start gap-3">
              <span className="rounded-lg bg-[#164033] p-2 text-white"><Sparkles size={18} /></span>
              <div>
                <p className="text-sm font-black text-[#8a8176]">가상 브랜드</p>
                <h3 className="mt-1 text-3xl font-black text-[#164033]">{simulation.virtualBrand.name}</h3>
                <p className="mt-2 text-sm font-bold leading-6 text-[#574d42]">{simulation.virtualBrand.tagline}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <Metric label="예상 월매출" value={formatManwon(simulation.results.monthlySales)} />
              <Metric label="점주 수익" value={formatManwon(simulation.results.estimatedOwnerProfit)} />
              <Metric label="일 주문" value={`${simulation.results.adjustedDailyOrders}건`} />
              <Metric label="입지 점수" value={`${Math.round(simulation.results.locationScore * 100)}점`} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-[#ddd2c0] p-4">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-[#b8642f]" />
                <h4 className="font-black text-[#164033]">공정위 업종 평균</h4>
              </div>
              <div className="mt-3 grid gap-2 text-sm font-bold">
                <Row label="월매출 중앙값" value={formatManwon(simulation.benchmark.monthly_sales_krw.median ?? 0)} />
                <Row label="창업비용 중앙값" value={formatManwon(simulation.benchmark.startup_cost_krw.median ?? 0)} />
                <Row label="가맹점 수 중앙값" value={`${simulation.benchmark.store_count.median ?? 0}개`} />
                <Row label="폐점 유사율" value={formatPercentValue(simulation.benchmark.open_close.closure_like_rate_by_store)} />
              </div>
            </div>
            <div className="rounded-lg border border-[#ddd2c0] p-4">
              <div className="flex items-center gap-2">
                <Utensils size={18} className="text-[#b8642f]" />
                <h4 className="font-black text-[#164033]">대표 메뉴 원가</h4>
              </div>
              <div className="mt-3 grid gap-2 text-sm font-bold">
                {simulation.menus.slice(0, 5).map((menu) => (
                  <Row
                    key={menu.menu_name}
                    label={menu.menu_name}
                    value={`${formatWon(menu.recommended_price_band_krw[0])}~${formatWon(menu.recommended_price_band_krw[1])}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            {simulation.imageTemplates.slice(0, 4).map((template) => (
              <button
                key={template.template_id}
                type="button"
                onClick={() => testKieTemplate(template.image_path)}
                className="group overflow-hidden rounded-lg border border-[#ddd2c0] bg-[#f7f1e8] text-left"
              >
                <Image src={template.image_path} alt={template.visual_concept} width={420} height={315} className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]" />
                <div className="p-3">
                  <p className="flex items-center gap-1 text-xs font-black text-[#164033]"><ImageIcon size={14} /> KIE nano banana template</p>
                  <p className="mt-1 text-xs font-bold text-[#8a8176]">{template.hero_menu_visual} · {template.package_style}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-[#ddd2c0] p-4">
            <h4 className="font-black text-[#164033]">입지 보정</h4>
            <div className="mt-3 grid gap-2 text-sm font-bold">
              <Row label="행정구역" value={simulation.locationProfile.administrativeDistrict} />
              <Row label="동일 소분류 업소" value={`${simulation.locationProfile.metrics.sameSmallStoresInRadius}개`} />
              <Row label="경쟁 밀도" value={`${simulation.locationProfile.metrics.sameSmallStoreDensityPerKm2}/km²`} />
              <Row label="SNS 키워드" value={simulation.locationProfile.snsKeywords.keywords.join(", ")} />
            </div>
            <div className="mt-3 rounded-lg bg-[#f7f1e8] p-3 text-xs font-bold text-[#574d42]">
              {simulation.rule.explanation}
            </div>
            {message ? <p className="mt-3 rounded-lg bg-[#dff1e5] p-3 text-xs font-black text-[#164033]">{message}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#f7f1e8] p-3">
      <p className="text-xs font-black text-[#8a8176]">{label}</p>
      <p className="mt-1 text-lg font-black text-[#164033]">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#eee4d7] px-3 py-2">
      <span className="text-[#655d52]">{label}</span>
      <span className="text-right text-[#164033]">{value}</span>
    </div>
  );
}
