"use client";

import type { BrandOption } from "@/lib/branch/types";

export function BrandOptionTabs({ brands, selectedId, onSelect }: { brands: BrandOption[]; selectedId: string; onSelect: (brandId: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {brands.map((brand) => (
        <button
          key={brand.id}
          type="button"
          onClick={() => onSelect(brand.id)}
          className={`rounded-lg border px-4 py-3 text-sm font-black ${brand.id === selectedId ? "border-[#164033] bg-[#164033] text-white" : "border-[#ddd2c0] bg-white text-[#574d42]"}`}
        >
          {brand.name}
        </button>
      ))}
    </div>
  );
}
