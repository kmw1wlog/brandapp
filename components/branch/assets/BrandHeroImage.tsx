import type { BrandOption } from "@/lib/branch/types";
import { getHeroAsset } from "@/lib/branch/assets";
import { BranchBadge } from "@/components/branch/ui/BranchBadge";
import { BranchImage } from "@/components/branch/ui/BranchImage";

export function BrandHeroImage({ brand }: { brand: BrandOption }) {
  const asset = getHeroAsset(brand.id);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10">
      <div className="relative aspect-[16/10]">
        <BranchImage src={asset.selectedUrl} alt={`${brand.name} ${asset.title}`} priority />
      </div>
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <BranchBadge tone="info">샘플 시안</BranchBadge>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
        <p className="text-xs font-bold text-white/75">외부 이미지 생성 API 연결 전 샘플 동작입니다</p>
        <h3 className="mt-1 text-2xl font-black">{brand.name}</h3>
      </div>
    </div>
  );
}
