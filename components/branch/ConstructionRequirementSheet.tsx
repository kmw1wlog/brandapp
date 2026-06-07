"use client";

import { formatRange } from "@/lib/branch/format";
import type { ConstructionRequirements } from "@/lib/branch/types";

export function ConstructionRequirementSheet({ requirements }: { requirements: ConstructionRequirements }) {
  const size = requirements.expected_size as { min_pyeong: number; max_pyeong: number };
  const budget = requirements.budget_range as { min: number; max: number; excludes: string[] };
  const hall = requirements.hall_layout as { solo_seats: number; two_person_tables: number; four_person_tables: number; notes: string };
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-black text-[#164033]">시공사 전달 요구사항서</h3>
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-[#164033] px-3 py-2 text-sm font-black text-white">PDF 인쇄</button>
      </div>
      <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <Item label="브랜드명" value={requirements.brand_name} />
        <Item label="업종" value={requirements.business_type} />
        <Item label="매장 형태" value={requirements.operating_type} />
        <Item label="예상 평수" value={`${size.min_pyeong}~${size.max_pyeong}평`} />
        <Item label="희망 지역" value={requirements.target_region} />
        <Item label="주요 메뉴" value={requirements.main_menu.join(", ")} />
        <Item label="홀 구성" value={`1인석 ${hall.solo_seats}, 2인석 ${hall.two_person_tables}, 4인석 ${hall.four_person_tables}`} />
        <Item label="포장 동선" value={requirements.pickup_flow} />
        <Item label="주방기기" value={requirements.required_kitchen_equipment.join(", ")} />
        <Item label="필요 공사" value={requirements.required_construction.join(", ")} />
        <Item label="인테리어 무드" value={requirements.interior_mood} />
        <Item label="간판 방향" value={requirements.signage_direction} />
        <Item label="예산 범위" value={formatRange(budget.min, budget.max)} />
        <Item label="제외 확인" value={budget.excludes.join(", ")} />
      </dl>
      <p className="mt-5 rounded-lg bg-[#f6f1e8] p-4 text-sm leading-6">{requirements.quote_request_message}</p>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-black text-[#164033]">{label}</dt><dd className="mt-1 text-[#655d52]">{value || "데이터 확인 필요"}</dd></div>;
}
