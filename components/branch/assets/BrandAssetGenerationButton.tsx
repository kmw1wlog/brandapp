"use client";

import { useState } from "react";
import type { BrandAsset, BrandAssetKind } from "@/lib/branch/types";
import { saveBrandImageJob } from "@/lib/branch/image/brand-image-store";
import { BranchButton } from "@/components/branch/ui/BranchButton";
import { BranchModal } from "@/components/branch/ui/BranchModal";
import { BranchTabs } from "@/components/branch/ui/BranchTabs";
import { getAssetKindLabel } from "@/lib/branch/assets";

const kinds: BrandAssetKind[] = ["storefront", "interior", "signature_menu", "packaging"];
const pollDelayMs = 5000;
const maxPollCount = 24;

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
  const [message, setMessage] = useState("선택한 템플릿을 기반으로 실제 KIE 이미지 생성을 실행합니다.");
  const selected = assets.find((asset) => asset.kind === kind) ?? assets[0];

  async function generateAsset() {
    if (!selected) return;

    setLoading(true);
    setMessage("KIE 생성 요청을 보내는 중입니다.");

    try {
      const response = await fetch("/api/branch/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          brandName,
          kind,
          templateUrl: selected.selectedUrl
        })
      });
      const job = await response.json();
      saveBrandImageJob(job);

      if (job.mock) {
        setMessage("KIE API 키가 없어 기존 템플릿을 유지했습니다.");
        return;
      }

      if (job.status === "success" && typeof job.generatedUrl === "string") {
        const nextAsset: BrandAsset = {
          ...selected,
          generatedUrl: job.generatedUrl,
          selectedUrl: job.generatedUrl,
          status: "generated"
        };
        onApply?.(nextAsset);
        setMessage("이전에 성공한 KIE 생성 결과를 다시 반영했습니다.");
        return;
      }

      if (!job.taskId || job.status === "fail") {
        setMessage(job.errorMessage ?? "KIE 작업 생성에 실패했습니다.");
        return;
      }

      setMessage(`KIE 작업이 생성되었습니다. taskId ${job.taskId} 완료 여부를 확인합니다.`);
      const generatedUrl = await pollJobUntilComplete(job.taskId);
      const nextAsset: BrandAsset = {
        ...selected,
        generatedUrl,
        selectedUrl: generatedUrl,
        status: "generated"
      };
      onApply?.(nextAsset);
      setMessage("KIE 생성이 완료되어 새 시안을 반영했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "KIE 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BranchButton type="button" variant="secondary" onClick={() => setOpen(true)}>{buttonLabel}</BranchButton>
      <BranchModal open={open} title="KIE 이미지 생성" onClose={() => setOpen(false)}>
        <div className="grid gap-4">
          <p className="text-sm leading-6 text-[color:var(--branch-ink-muted)]">{message}</p>
          <BranchTabs items={kinds.map((value) => ({ label: getAssetKindLabel(value), value }))} value={kind} onChange={setKind} />
          <div className="rounded-xl bg-[color:var(--branch-surface-muted)] p-4 text-sm font-bold text-[color:var(--branch-ink-muted)]">
            {loading ? "KIE 작업 진행 중..." : `${selected?.title ?? "시안"} 템플릿으로 새 이미지를 생성합니다.`}
          </div>
          <div className="flex flex-wrap gap-2">
            <BranchButton type="button" onClick={generateAsset}>{loading ? "생성 중" : "실제 KIE 생성 실행"}</BranchButton>
            <BranchButton type="button" variant="secondary" onClick={() => { if (selected) onApply?.(selected); setOpen(false); }}>현재 템플릿 유지</BranchButton>
            <BranchButton type="button" variant="ghost" onClick={() => setOpen(false)}>취소</BranchButton>
          </div>
        </div>
      </BranchModal>
    </>
  );
}

async function pollJobUntilComplete(taskId: string) {
  for (let attempt = 0; attempt < maxPollCount; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, pollDelayMs));
    }

    const response = await fetch(`/api/branch/images/status?taskId=${encodeURIComponent(taskId)}`);
    const status = await response.json();
    if (status.status === "success" && typeof status.resultUrls?.[0] === "string") {
      return status.resultUrls[0] as string;
    }
    if (status.status === "fail") {
      throw new Error(status.errorMessage ?? "KIE 작업이 실패했습니다.");
    }
  }

  throw new Error("KIE 생성 대기 시간이 초과되었습니다.");
}
