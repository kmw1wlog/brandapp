"use client";

import type { BrandAsset } from "@/lib/branch/types";
import { BranchModal } from "@/components/branch/ui/BranchModal";
import { BranchImage } from "@/components/branch/ui/BranchImage";
import { BranchBadge } from "@/components/branch/ui/BranchBadge";

export function BrandAssetModal({ asset, onClose }: { asset?: BrandAsset; onClose: () => void }) {
  return (
    <BranchModal open={Boolean(asset)} title={asset?.title ?? "브랜드 시안"} onClose={onClose}>
      {asset ? (
        <div className="grid gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <BranchImage src={asset.selectedUrl} alt={`${asset.title} 확대 이미지`} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BranchBadge tone="info">샘플 시안</BranchBadge>
            <BranchBadge>외부 이미지 생성 API 연결 전 샘플 동작입니다</BranchBadge>
          </div>
          <p className="text-sm leading-6 text-[color:var(--branch-ink-muted)]">{asset.description}</p>
        </div>
      ) : null}
    </BranchModal>
  );
}
