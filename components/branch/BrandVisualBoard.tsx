import type { BrandOption } from "@/lib/branch/types";

export function BrandVisualBoard({ brand }: { brand: BrandOption }) {
  const labels = ["매장 외부 시안", "인테리어 시안", "대표 메뉴 시안", "패키지 시안"];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {labels.map((label, index) => (
        <div key={label} className="aspect-[4/3] rounded-lg border border-white/20 bg-[linear-gradient(135deg,#4b2d1f,#164033_55%,#d9a15e)] p-4 text-white">
          <p className="text-sm font-black">{label}</p>
          <p className="mt-2 text-xs text-white/75">{brand.name} · {brand.color_mood[index % brand.color_mood.length]}</p>
        </div>
      ))}
    </div>
  );
}
