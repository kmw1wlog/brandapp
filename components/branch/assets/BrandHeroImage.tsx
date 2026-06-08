import type { BrandAsset, BrandOption } from "@/lib/branch/types";
import { BranchBadge } from "@/components/branch/ui/BranchBadge";
import { BranchImage } from "@/components/branch/ui/BranchImage";

export function BrandHeroImage({ brand, asset }: { brand: BrandOption; asset: BrandAsset }) {
  const isGenerated = asset.status === "generated" || Boolean(asset.generatedUrl);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10">
      <div className="relative aspect-[16/10]">
        <BranchImage src={asset.selectedUrl} alt={`${brand.name} ${asset.title}`} priority />
      </div>
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <BranchBadge tone={isGenerated ? "success" : "info"}>{isGenerated ? "KIE 생성 완료" : "템플릿 기반 생성"}</BranchBadge>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
        <p className="text-xs font-bold text-white/75">{isGenerated ? "KIE가 생성한 최신 시안을 반영했습니다" : "현재 템플릿을 기반으로 KIE 생성 시안을 만들 수 있습니다"}</p>
        <h3 className="mt-1 text-2xl font-black">{brand.name}</h3>
      </div>
    </div>
  );
}
