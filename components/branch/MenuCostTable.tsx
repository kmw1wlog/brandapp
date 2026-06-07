import { calculateMenuMargin } from "@/lib/branch/calculations";
import { formatKRW, formatPercent } from "@/lib/branch/format";
import type { MenuCost } from "@/lib/branch/types";
import type { RealMenuCost } from "@/lib/branch/real-types";
import { DataQualityBadge } from "./data/DataQualityBadge";

export function MenuCostTable({ menus }: { menus: Array<MenuCost | RealMenuCost> }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#ddd2c0] bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-[#164033] text-white">
          <tr>
            {["메뉴", "판매가", "식재료비", "포장비", "목표 원가율", "홀 마진", "배달 마진", "실상품 연결"].map((header) => <th key={header} className="p-3">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => {
            const margin = calculateMenuMargin(menu);
            const realConnected = "ingredients" in menu ? menu.ingredients.filter((ingredient) => "connectedProductName" in ingredient && ingredient.connectedProductName).length : 0;
            return (
              <tr key={menu.id} className="border-t border-[#eee5d7]">
                <td className="p-3 font-black text-[#164033]">{menu.name}</td>
                <td className="p-3">{formatKRW(menu.selling_price)}</td>
                <td className="p-3">{formatKRW(menu.food_cost)}</td>
                <td className="p-3">{formatKRW(menu.packaging_cost)}</td>
                <td className="p-3">{formatPercent(menu.target_food_cost_rate)} <span className="text-xs text-[#7a7065]">({formatPercent(margin.foodCostRate)})</span></td>
                <td className="p-3 font-bold">{formatKRW(menu.hall_margin)}</td>
                <td className="p-3 font-bold">{formatKRW(menu.delivery_margin)}</td>
                <td className="p-3">{realConnected > 0 ? <DataQualityBadge status="verified_product" /> : <DataQualityBadge status="sample_value" />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
