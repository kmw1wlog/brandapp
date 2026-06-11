"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/branch/Common";
import { getBrandById, getConstructionRequirements, getConsultationQuestions, getEquipmentList } from "@/lib/branch/data";
import { getRfpTemplates } from "@/lib/branch/user-input";
import { readStartupInput } from "@/lib/branch/storage/startup-flow-storage";
import { getBranchStorage } from "@/lib/branch/storage";
import { getMergedInfraData } from "@/lib/branch/infra/merge-infra-data";
import { formatManwon } from "@/lib/branch/finance/finance-format";
import brandAssetManifest from "@/src/data/branch/assets/brand_asset_manifest.json";
import type { BrandAsset } from "@/lib/branch/types";

export default function ConsultationRfpPage() {
  const [brandId, setBrandId] = useState("brand_yukbanjang");
  const [copied, setCopied] = useState(false);
  const input = readStartupInput();
  const brand = getBrandById(brandId);
  const templates = getRfpTemplates();
  const constructionTemplate = templates.construction;
  const infra = getMergedInfraData();
  const equipment = getEquipmentList();
  const imageUrl = useMemo(() => {
    const assets = (brandAssetManifest as BrandAsset[]).filter((asset) => asset.brandId === brand.id);
    return assets.find((asset) => asset.kind === "interior")?.selectedUrl ?? assets[0]?.selectedUrl ?? "/branch/image_template/6136472466361094021.jpg";
  }, [brand.id]);
  const message = (constructionTemplate.message_template ?? "")
    .replace("{size_pyeong}", String(input.desired_size_pyeong ?? 15))
    .replace("{brand_name}", brand.name);

  useEffect(() => {
    getBranchStorage().getSelectedBrand().then(setBrandId);
  }, []);

  async function copyMessage() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        title="원클릭 상담발주 RFP"
        subtitle="시공사·공급처·홍보 파트너에게 보낼 요구사항서를 한 화면에서 미리 보고 인쇄합니다."
        warning="계약 전 재확인 필요. 서버 PDF 생성이 아니라 브라우저 인쇄 기반 HTML 미리보기입니다."
      />
      <section className="rounded-lg border border-[#ddd2c0] bg-white p-5 print:border-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#b8642f]">1페이지: 브랜드 요약</p>
            <h3 className="mt-1 text-2xl font-black text-[#164033]">{brand.name} {constructionTemplate.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655d52]">{brand.concept}</p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button type="button" onClick={() => window.print()} className="rounded-lg bg-[#164033] px-4 py-3 text-sm font-black text-white">PDF로 인쇄</button>
            <button type="button" onClick={copyMessage} className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">{copied ? "복사 완료" : "상담사에게 보낼 메시지 복사"}</button>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
          <div>
            <p className="mb-2 text-sm font-black text-[#b8642f]">2페이지: 인테리어/외관 이미지</p>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-[#ddd2c0] bg-[#f6f1e8]">
              <Image src={imageUrl} alt={`${brand.name} 인테리어 이미지`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 420px" />
            </div>
            <p className="mt-2 text-xs font-bold text-[#655d52]">KIE API 키가 없으면 외부 이미지 생성 API 연결 전 샘플 동작입니다. template 이미지를 유지합니다.</p>
          </div>
          <div className="grid gap-4">
            <Info label="평수" value={`${input.desired_size_pyeong ?? 15}평`} />
            <Info label="운영 형태" value={input.operation_type} />
            <Info label="예산" value={formatManwon(input.budget)} />
            <Info label="목표 개점일" value={input.opening_target.type === "date" ? input.opening_target.date ?? "미정" : `${input.opening_target.days ?? 45}일 뒤`} />
            <Info label="메뉴" value={brand.menu_board_copy} />
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Panel title="3페이지: 주방설비·동선 요구사항" items={[...equipment.map((item) => item.name), ...infra.equipmentProductLeads.slice(0, 4).map((item) => item.productName)]} />
          <Panel title="4페이지: 예산·공사 범위" items={getConstructionRequirements().required_construction} />
          <Panel title="5페이지: 상담 질문 체크리스트" items={getConsultationQuestions().flatMap((category) => category.questions.map((question) => question.question)).slice(0, 8)} />
          <Panel title="견적 요청 메시지" items={[message]} />
        </div>
      </section>
      <div className="flex flex-wrap gap-3 print:hidden">
        <Link href="/dashboard/startup/owner-conversion" className="rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">점주 전환 미리보기</Link>
        <Link href="/dashboard/startup/consultation" className="rounded-lg border border-[#cbbda8] px-4 py-3 text-sm font-black text-[#574d42]">상담신청으로 돌아가기</Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f6f1e8] p-3"><p className="text-xs font-bold text-[#7a7065]">{label}</p><p className="mt-1 font-black text-[#164033]">{value}</p></div>;
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[#ddd2c0] p-4">
      <h4 className="font-black text-[#164033]">{title}</h4>
      <ul className="mt-3 grid gap-2 text-sm font-bold text-[#655d52]">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </section>
  );
}
