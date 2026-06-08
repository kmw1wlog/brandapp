"use client";

import type { BrandAsset } from "@/lib/branch/types";
import { BranchModal } from "@/components/branch/ui/BranchModal";
import { BranchImage } from "@/components/branch/ui/BranchImage";
import { BranchBadge } from "@/components/branch/ui/BranchBadge";

export function BrandAssetModal({ asset, onClose }: { asset?: BrandAsset; onClose: () => void }) {
  const isGenerated = asset?.status === "generated" || Boolean(asset?.generatedUrl);
  return (
    <BranchModal open={Boolean(asset)} title={asset?.title ?? "브랜드 시안"} onClose={onClose}>
      {asset ? (
        <div className="grid gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <BranchImage src={asset.selectedUrl} alt={`${asset.title} 확대 이미지`} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BranchBadge tone={isGenerated ? "success" : "info"}>{isGenerated ? "KIE 생성 완료" : "템플릿"}</BranchBadge>
            <BranchBadge>{isGenerated ? "실제 KIE 생성 결과를 반영했습니다" : "현재 템플릿을 기반으로 다시 생성할 수 있습니다"}</BranchBadge>
          </div>
          <p className="text-sm leading-6 text-[color:var(--branch-ink-muted)]">{asset.description}</p>
        </div>
      ) : null}
    </BranchModal>
  );
}
