"use client";

import { useState } from "react";
import type { BrandAsset, BrandOption } from "@/lib/branch/types";
import { getBrandAssets } from "@/lib/branch/assets";
import { BrandAssetCard } from "./BrandAssetCard";
import { BrandAssetGenerationButton } from "./BrandAssetGenerationButton";
import { BrandAssetModal } from "./BrandAssetModal";

export function BrandAssetGallery({ brand, compact = false }: { brand: BrandOption; compact?: boolean }) {
  const assets = getBrandAssets(brand.id);
  const [selected, setSelected] = useState<BrandAsset | undefined>();

  return (
    <section className="grid gap-3">
      {!compact ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[color:var(--branch-primary)]">브랜드 이미지 보드</h2>
            <p className="mt-1 text-xs font-bold text-[color:var(--branch-ink-muted)]">외부 이미지 생성 API 연결 전 샘플 동작입니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <BrandAssetGenerationButton brandId={brand.id} brandName={brand.name} assets={assets} defaultKind="storefront" buttonLabel="AI로 외관 다시 생성" />
            <BrandAssetGenerationButton brandId={brand.id} brandName={brand.name} assets={assets} defaultKind="interior" buttonLabel="AI로 인테리어 다시 생성" />
            <BrandAssetGenerationButton brandId={brand.id} brandName={brand.name} assets={assets} defaultKind="signature_menu" buttonLabel="AI로 메뉴 이미지 다시 생성" />
            <BrandAssetGenerationButton brandId={brand.id} brandName={brand.name} assets={assets} defaultKind="packaging" buttonLabel="AI로 패키지 다시 생성" />
          </div>
        </div>
      ) : null}
      <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
        {assets.map((asset, index) => <BrandAssetCard key={asset.id} asset={asset} onOpen={setSelected} priority={index === 0} />)}
      </div>
      <BrandAssetModal asset={selected} onClose={() => setSelected(undefined)} />
    </section>
  );
}
