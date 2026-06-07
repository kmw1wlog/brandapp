import type { LocationCriteria } from "@/lib/branch/types";
import { Badge } from "./Common";

export function LocationCriteriaCards({ criteria }: { criteria: LocationCriteria }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {criteria.must_have.map((item) => (
        <div key={item.criterion} className="rounded-lg border border-[#ddd2c0] bg-white p-4">
          <Badge>{item.weight}점</Badge>
          <p className="mt-2 text-sm font-bold text-[#164033]">{item.criterion}</p>
        </div>
      ))}
      <div className="rounded-lg border border-[#e0b4a8] bg-[#fff5f2] p-4 md:col-span-3">
        <p className="font-black text-[#8b2f1f]">상권 리스크</p>
        <p className="mt-2 text-sm text-[#655d52]">{criteria.red_flags.join(", ")}</p>
      </div>
    </div>
  );
}
