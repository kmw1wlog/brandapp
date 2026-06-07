"use client";

import type { BrandAsset } from "@/lib/branch/types";
import { getAssetKindLabel } from "@/lib/branch/assets";
import { BranchBadge } from "@/components/branch/ui/BranchBadge";
import { BranchImage } from "@/components/branch/ui/BranchImage";

export function BrandAssetCard({ asset, onOpen, priority = false }: { asset: BrandAsset; onOpen?: (asset: BrandAsset) => void; priority?: boolean }) {
  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[color:var(--branch-surface-muted)]">
        <BranchImage src={asset.selectedUrl} alt={`${asset.title} - ${asset.description}`} priority={priority} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[color:var(--branch-accent)]">{getAssetKindLabel(asset.kind)}</p>
          <h3 className="mt-1 font-black text-[color:var(--branch-primary)]">{asset.title}</h3>
          <p className="mt-1 text-xs leading-5 text-[color:var(--branch-ink-muted)]">{asset.description}</p>
        </div>
        <BranchBadge tone="info">샘플 시안</BranchBadge>
      </div>
    </>
  );

  if (!onOpen) return <article className="min-w-0 rounded-2xl border border-white/15 bg-white/10 p-3">{body}</article>;

  return (
    <button type="button" onClick={() => onOpen(asset)} className="min-w-0 w-full rounded-2xl border border-[color:var(--branch-border)] bg-white p-3 text-left shadow-[var(--branch-shadow)] transition hover:-translate-y-0.5 hover:shadow-lg">
      {body}
    </button>
  );
}
