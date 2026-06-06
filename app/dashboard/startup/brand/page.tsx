"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandConceptCard } from "@/components/BrandConceptCard";
import { InteriorPreviewCard } from "@/components/InteriorPreviewCard";
import { LoadingState } from "@/components/LoadingState";
import { getFallbackInteriorConcept } from "@/lib/ai/fallback";
import { getBrandReferences } from "@/lib/db/local";
import { saveSelectedBrandId } from "@/lib/storage";
import type { BrandReference } from "@/lib/types";

export default function BrandPage() {
  const [brands, setBrands] = useState<BrandReference[]>(getBrandReferences());
  const [selected, setSelected] = useState("brand_001");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const interior = getFallbackInteriorConcept();

  async function regenerate() {
    setLoading(true);
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: "brand_generation", context: { selected_menu: "우삼겹 덮밥", region: "부산 대학가" } })
    });
    const result = await response.json();
    if (Array.isArray(result?.data?.concepts)) setBrands(result.data.concepts);
    setLoading(false);
  }

  async function generateImage() {
    setImageLoading(true);
    const response = await fetch("/api/image/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "interior", prompt: interior.image_prompt, referenceImages: [] })
    });
    const result = await response.json();
    setImageUrl(result?.imageUrl ?? null);
    setImageLoading(false);
  }

  function chooseBrand(id: string) {
    setSelected(id);
    saveSelectedBrandId(id);
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-bold text-clay">5단계</p><h2 className="mt-2 text-3xl font-black text-forest">브랜드/인테리어</h2></div>
        <div className="flex flex-wrap gap-3"><button onClick={regenerate} className="rounded-2xl bg-forest px-5 py-3 text-sm font-black text-cream">다른 콘셉트 다시 생성</button><Link href="/dashboard/startup/operation" className="rounded-2xl bg-clay px-5 py-3 text-sm font-black text-white">운영/홍보 보기</Link></div>
      </div>
      {loading ? <LoadingState label="브랜드 콘셉트를 다시 구성 중입니다" /> : null}
      <div className="grid gap-5 lg:grid-cols-3">
        {brands.map((brand) => <BrandConceptCard key={brand.id} brand={brand} selected={brand.id === selected} action={<button onClick={() => chooseBrand(brand.id)} className="w-full rounded-2xl bg-clay px-4 py-3 text-sm font-black text-white">이 브랜드 선택</button>} />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h3 className="text-xl font-black text-forest">인테리어 방향</h3>
          <dl className="mt-5 grid gap-3 text-sm text-ink/70 md:grid-cols-2">
            <div><dt className="font-black text-forest">매장 콘셉트</dt><dd>{interior.store_concept}</dd></div>
            <div><dt className="font-black text-forest">컬러/마감재</dt><dd>{interior.color_finish}</dd></div>
            <div><dt className="font-black text-forest">간판</dt><dd>{interior.sign}</dd></div>
            <div><dt className="font-black text-forest">좌석 구성</dt><dd>{interior.seats}</dd></div>
            <div><dt className="font-black text-forest">주방 동선</dt><dd>{interior.kitchen_flow}</dd></div>
            <div><dt className="font-black text-forest">포장/픽업 동선</dt><dd>{interior.pickup_flow}</dd></div>
            <div><dt className="font-black text-forest">조명</dt><dd>{interior.lighting}</dd></div>
            <div><dt className="font-black text-forest">메뉴판 배치</dt><dd>{interior.menu_board}</dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3"><button onClick={generateImage} className="rounded-2xl bg-forest px-5 py-3 text-sm font-black text-cream">인테리어 이미지 생성</button><button onClick={() => navigator.clipboard.writeText(interior.image_prompt)} className="rounded-2xl bg-cream px-5 py-3 text-sm font-black text-forest">이미지 프롬프트 복사</button></div>
          {imageLoading ? <div className="mt-4"><LoadingState label="이미지 생성 API를 확인 중입니다" /></div> : null}
        </div>
        <InteriorPreviewCard prompt={interior.image_prompt} imageUrl={imageUrl} />
      </div>
    </section>
  );
}
