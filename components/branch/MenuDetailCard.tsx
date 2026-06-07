import { calculateBreakeven } from "@/lib/branch/calculations";
import { formatKRW, formatPercent } from "@/lib/branch/format";
import type { MenuCost } from "@/lib/branch/types";
import type { RealMenuCost } from "@/lib/branch/real-types";
import { DataQualityBadge } from "./data/DataQualityBadge";

export function MenuDetailCard({ menu }: { menu: MenuCost | RealMenuCost }) {
  const breakeven = calculateBreakeven(3100000, menu.delivery_margin);
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-xl font-black text-[#164033]">대표 메뉴 상세</h3>
      <p className="mt-1 text-sm text-[#655d52]">{menu.name}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Metric label="판매가" value={formatKRW(menu.selling_price)} />
        <Metric label="식재료비" value={formatKRW(menu.food_cost)} />
        <Metric label="포장비" value={formatKRW(menu.packaging_cost)} />
        <Metric label="목표 원가율" value={formatPercent(menu.target_food_cost_rate)} />
        <Metric label="손익분기 일 판매량" value={`${breakeven.dailyServings.toFixed(1)}그릇`} />
        <Metric label="배달 포함 공헌이익" value={formatKRW(menu.delivery_margin)} />
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#ddd2c0] text-[#655d52]">
              {["원재료", "사용량", "사용 단가", "단가 출처", "연결 상품", "가격 상태"].map((header) => <th key={header} className="py-2 pr-3">{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {menu.ingredients.map((ingredient) => (
              <tr key={ingredient.name} className="border-b border-[#f0e8db] align-top">
                <td className="py-3 pr-3 font-black text-[#164033]">{ingredient.name}</td>
                <td className="py-3 pr-3">{ingredient.amount}{ingredient.unit}</td>
                <td className="py-3 pr-3">{"unitPriceText" in ingredient ? ingredient.unitPriceText : formatKRW(ingredient.cost)}</td>
                <td className="py-3 pr-3">{"sourceLabel" in ingredient ? ingredient.sourceLabel : "샘플 단가"}</td>
                <td className="py-3 pr-3">{"connectedProductName" in ingredient && ingredient.connectedProductName ? <a href={ingredient.connectedProductUrl ?? "#"} target="_blank" rel="noopener noreferrer" className="text-[#b8642f] underline">{ingredient.connectedProductName}</a> : "연결 상품 없음"}</td>
                <td className="py-3 pr-3"><DataQualityBadge status={"priceStatus" in ingredient ? ingredient.priceStatus === "confirmed" ? "verified_product" : ingredient.priceStatus === "missing_price" ? "price_missing" : "sample_value" : "sample_value"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 grid gap-2 text-sm text-[#655d52]">{menu.risk_notes.map((note) => <li key={note}>- {note}</li>)}</ul>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f6f1e8] p-3"><p className="text-xs font-bold text-[#7a7065]">{label}</p><p className="mt-1 font-black text-[#164033]">{value}</p></div>;
}
