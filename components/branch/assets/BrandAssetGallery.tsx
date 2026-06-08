"use client";

import { useEffect, useState } from "react";
import type { BrandAsset, BrandOption } from "@/lib/branch/types";
import { getBrandAssets } from "@/lib/branch/assets";
import { BrandHeroImage } from "./BrandHeroImage";
import { BrandAssetCard } from "./BrandAssetCard";
import { BrandAssetGenerationButton } from "./BrandAssetGenerationButton";
import { BrandAssetModal } from "./BrandAssetModal";

export function BrandAssetGallery({ brand, compact = false }: { brand: BrandOption; compact?: boolean }) {
  const [assets, setAssets] = useState<BrandAsset[]>(() => getBrandAssets(brand.id));
  const [selected, setSelected] = useState<BrandAsset | undefined>();
  const heroAsset = assets.find((asset) => asset.kind === "storefront") ?? assets[0];

  useEffect(() => {
    setAssets(getBrandAssets(brand.id));
    setSelected(undefined);
  }, [brand.id]);

  function applyGeneratedAsset(nextAsset: BrandAsset) {
    setAssets((currentAssets) => currentAssets.map((asset) => asset.id === nextAsset.id ? nextAsset : asset));
    setSelected((currentSelected) => currentSelected?.id === nextAsset.id ? nextAsset : currentSelected);
  }

  return (
    <section className="grid gap-3">
      {heroAsset ? <BrandHeroImage brand={brand} asset={heroAsset} /> : null}
      {!compact ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[color:var(--branch-primary)]">브랜드 이미지 보드</h2>
            <p className="mt-1 text-xs font-bold text-[color:var(--branch-ink-muted)]">선택한 템플릿을 바탕으로 실제 KIE 이미지를 생성하고 바로 교체합니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <BrandAssetGenerationButton brandId={brand.id} brandName={brand.name} assets={assets} onApply={applyGeneratedAsset} defaultKind="storefront" buttonLabel="AI로 외관 다시 생성" />
            <BrandAssetGenerationButton brandId={brand.id} brandName={brand.name} assets={assets} onApply={applyGeneratedAsset} defaultKind="interior" buttonLabel="AI로 인테리어 다시 생성" />
            <BrandAssetGenerationButton brandId={brand.id} brandName={brand.name} assets={assets} onApply={applyGeneratedAsset} defaultKind="signature_menu" buttonLabel="AI로 메뉴 이미지 다시 생성" />
            <BrandAssetGenerationButton brandId={brand.id} brandName={brand.name} assets={assets} onApply={applyGeneratedAsset} defaultKind="packaging" buttonLabel="AI로 패키지 다시 생성" />
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
