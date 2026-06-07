"use client";

import { useState } from "react";
import type { BrandAsset, BrandAssetKind } from "@/lib/branch/types";
import { saveBrandImageJob } from "@/lib/branch/image/brand-image-store";
import { BranchButton } from "@/components/branch/ui/BranchButton";
import { BranchModal } from "@/components/branch/ui/BranchModal";
import { BranchTabs } from "@/components/branch/ui/BranchTabs";
import { getAssetKindLabel } from "@/lib/branch/assets";

const kinds: BrandAssetKind[] = ["storefront", "interior", "signature_menu", "packaging"];

export function BrandAssetGenerationButton({
  brandId,
  brandName,
  assets,
  onApply,
  defaultKind = "storefront",
  buttonLabel = "AI 시안 다시 보기"
}: {
  brandId: string;
  brandName: string;
  assets: BrandAsset[];
  onApply?: (asset: BrandAsset) => void;
  defaultKind?: BrandAssetKind;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<BrandAssetKind>(defaultKind);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("외부 이미지 생성 API 연결 전 샘플 동작입니다. 지금은 기존 정적 템플릿을 유지하며, 실제로 새로운 이미지를 생성하지 않습니다.");
  const selected = assets.find((asset) => asset.kind === kind) ?? assets[0];

  async function mockGenerate() {
    setLoading(true);
    const response = await fetch("/api/branch/images/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandId,
        brandName,
        kind,
        templateUrl: selected?.selectedUrl
      })
    });
    const job = await response.json();
    saveBrandImageJob(job);
    setMessage(job.mock ? "샘플 생성 흐름만 표시합니다. 기존 템플릿 이미지를 유지합니다." : job.status === "queued" ? "KIE 작업이 생성되었습니다. 상태 polling 후 적용할 수 있습니다." : "생성 실패 시 템플릿 이미지를 유지합니다.");
    setLoading(false);
  }

  return (
    <>
      <BranchButton type="button" variant="secondary" onClick={() => setOpen(true)}>{buttonLabel}</BranchButton>
      <BranchModal open={open} title="이미지 생성 API 연결 전 샘플" onClose={() => setOpen(false)}>
        <div className="grid gap-4">
          <p className="text-sm leading-6 text-[color:var(--branch-ink-muted)]">{message}</p>
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
