"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBrandOptions, getConsultantCategories } from "@/lib/branch/data";
import { saveConsultationLead, saveTimelineStatus, trackEvent } from "@/lib/branch/events";

export function ConsultationLeadForm() {
  const params = useSearchParams();
  const categories = getConsultantCategories();
  const brands = getBrandOptions();
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const taskId = params.get("taskId") ?? undefined;
    saveConsultationLead({
      name: String(form.get("name") ?? ""),
      contact: String(form.get("contact") ?? ""),
      region: String(form.get("region") ?? ""),
      capital: String(form.get("capital") ?? ""),
      openDate: String(form.get("openDate") ?? ""),
      category: String(form.get("category") ?? ""),
      brandId: String(form.get("brandId") ?? ""),
      concern: String(form.get("concern") ?? ""),
      taskId
    });
    if (taskId) saveTimelineStatus(taskId, "상담 대기");
    trackEvent("consultation_waitlist_submit", { category: String(form.get("category") ?? ""), task_id: taskId });
    setSaved(true);
  }

  if (saved) {
    return <p className="rounded-lg bg-[#e8f3eb] p-5 text-sm font-bold leading-6 text-[#164033]">상담 대기 신청이 완료되었습니다. 시공사·창업 컨설턴트·홍보 파트너 입점이 완료되면 입력하신 연락처로 안내드리겠습니다. 지금은 질문 템플릿과 요구사항서를 내려받아 직접 상담에 활용할 수 있습니다.</p>;
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border border-[#ddd2c0] bg-white p-5 text-sm md:grid-cols-2">
      <Input name="name" label="이름/닉네임" />
      <Input name="contact" label="연락처 또는 이메일" required />
      <Input name="region" label="창업 예정 지역" defaultValue="부산 대학가" />
      <Input name="capital" label="자본" defaultValue="5,000만원" />
      <Input name="openDate" label="희망 오픈일" defaultValue="1개월 뒤" />
      <label className="grid gap-1 font-bold">상담 받고 싶은 항목<select name="category" className="rounded-md border border-[#ddd2c0] p-2" defaultValue={params.get("category") ?? "시공사"}>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select></label>
      <label className="grid gap-1 font-bold">선택 브랜드안<select name="brandId" className="rounded-md border border-[#ddd2c0] p-2">{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>
      <label className="grid gap-1 font-bold md:col-span-2">현재 가장 불안한 점<textarea name="concern" className="min-h-24 rounded-md border border-[#ddd2c0] p-2" /></label>
      <p className="text-xs text-[#655d52] md:col-span-2">베타 테스트 단계에서는 입력하신 연락처를 상담 파트너 입점 알림과 후속 안내 목적으로만 사용합니다.</p>
      <button className="rounded-lg bg-[#b8642f] px-4 py-3 font-black text-white md:col-span-2">상담사 입점 시 연락받기</button>
    </form>
  );
}

function Input({ name, label, defaultValue, required }: { name: string; label: string; defaultValue?: string; required?: boolean }) {
  return <label className="grid gap-1 font-bold">{label}<input required={required} name={name} defaultValue={defaultValue} className="rounded-md border border-[#ddd2c0] p-2" /></label>;
}
