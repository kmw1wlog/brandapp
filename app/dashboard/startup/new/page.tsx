"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEMO_SCENARIO } from "@/lib/constants";
import { getStoredScenario, saveScenario } from "@/lib/storage";
import type { StartupScenario } from "@/lib/types";
import { won } from "@/lib/format";

const preview = ["메뉴 3개 추천", "원가 계산", "공급처 링크", "브랜드 콘셉트", "직원 공고문", "공동구매 후보"];

export default function StartupNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<StartupScenario>(DEMO_SCENARIO);

  useEffect(() => {
    setForm(getStoredScenario());
  }, []);

  function update<K extends keyof StartupScenario>(key: K, value: StartupScenario[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    saveScenario(form);
    router.push("/dashboard/startup/menu");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm font-bold text-clay">1단계</p>
        <h2 className="mt-2 text-3xl font-black text-forest">창업 조건 입력</h2>
        <p className="mt-2 text-ink/60">기본값만으로 부산 대학가 우삼겹 덮밥 창업 리포트를 바로 생성합니다.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-forest">창업 지역<input className="rounded-2xl border border-forest/15 bg-cream p-3" value={form.region} onChange={(event) => update("region", event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-bold text-forest">예산<input className="rounded-2xl border border-forest/15 bg-cream p-3" type="number" value={form.budget} onChange={(event) => update("budget", Number(event.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-forest">업종<input className="rounded-2xl border border-forest/15 bg-cream p-3" value={form.business_type} onChange={(event) => update("business_type", event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-bold text-forest">목표 월매출<input className="rounded-2xl border border-forest/15 bg-cream p-3" type="number" value={form.target_monthly_sales} onChange={(event) => update("target_monthly_sales", Number(event.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-forest">선호 메뉴<input className="rounded-2xl border border-forest/15 bg-cream p-3" value={form.preferred_menu} onChange={(event) => update("preferred_menu", event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-bold text-forest">창업 경험<input className="rounded-2xl border border-forest/15 bg-cream p-3" value={form.startup_experience} onChange={(event) => update("startup_experience", event.target.value)} /></label>
        </div>
        <button onClick={submit} className="mt-8 rounded-2xl bg-clay px-6 py-4 text-sm font-black text-white shadow-soft">AI 창업안 만들기</button>
      </section>
      <aside className="rounded-3xl bg-forest p-6 text-cream shadow-soft">
        <p className="text-sm font-bold text-clay">AI 창업 실행 리포트 미리보기</p>
        <h3 className="mt-3 text-2xl font-black">대표 메뉴: {form.selected_menu}</h3>
        <p className="mt-2 text-cream/75">예산 {won(form.budget)} · 목표 월매출 {won(form.target_monthly_sales)}</p>
        <div className="mt-6 grid gap-3">
          {preview.map((item) => <div key={item} className="rounded-2xl bg-white/10 p-3 text-sm font-bold">{item}</div>)}
        </div>
      </aside>
    </div>
  );
}
