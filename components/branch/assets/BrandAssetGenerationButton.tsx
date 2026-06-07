"use client";

import { useState } from "react";
import type { BrandAsset, BrandAssetKind } from "@/lib/branch/types";
import { BranchButton } from "@/components/branch/ui/BranchButton";
import { BranchModal } from "@/components/branch/ui/BranchModal";
import { BranchTabs } from "@/components/branch/ui/BranchTabs";
import { getAssetKindLabel } from "@/lib/branch/assets";

const kinds: BrandAssetKind[] = ["storefront", "interior", "signature_menu", "packaging"];

export function BrandAssetGenerationButton({ assets, onApply }: { assets: BrandAsset[]; onApply?: (asset: BrandAsset) => void }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<BrandAssetKind>("storefront");
  const [loading, setLoading] = useState(false);
  const selected = assets.find((asset) => asset.kind === kind) ?? assets[0];

  function mockGenerate() {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 650);
  }

  return (
    <>
      <BranchButton type="button" variant="secondary" onClick={() => setOpen(true)}>AI 시안 다시 보기</BranchButton>
      <BranchModal open={open} title="이미지 생성 API 연결 전 샘플" onClose={() => setOpen(false)}>
        <div className="grid gap-4">
          <p className="text-sm leading-6 text-[color:var(--branch-ink-muted)]">외부 이미지 생성 API 연결 전 샘플 동작입니다. 지금은 기존 정적 템플릿을 유지하며, 실제로 새로운 이미지를 생성하지 않습니다.</p>
          <BranchTabs items={kinds.map((value) => ({ label: getAssetKindLabel(value), value }))} value={kind} onChange={setKind} />
          <div className="rounded-xl bg-[color:var(--branch-surface-muted)] p-4 text-sm font-bold text-[color:var(--branch-ink-muted)]">
            {loading ? "샘플 로딩 중..." : `${selected?.title ?? "시안"} 템플릿을 미리 봅니다.`}
          </div>
          <div className="flex flex-wrap gap-2">
            <BranchButton type="button" onClick={mockGenerate}>{loading ? "확인 중" : "샘플 시안 확인"}</BranchButton>
            <BranchButton type="button" variant="secondary" onClick={() => { if (selected) onApply?.(selected); setOpen(false); }}>현재 템플릿 적용</BranchButton>
            <BranchButton type="button" variant="ghost" onClick={() => setOpen(false)}>취소</BranchButton>
          </div>
        </div>
      </BranchModal>
    </>
  );
}
