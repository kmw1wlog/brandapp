"use client";

export function SupplierTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const tabs = ["식재료", "포장재", "주방설비", "간판/인쇄", "공동구매", "데이터 품질"];
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((tab) => <button key={tab} type="button" onClick={() => onChange(tab)} className={`rounded-lg px-4 py-2 text-sm font-black ${value === tab ? "bg-[#164033] text-white" : "bg-white text-[#574d42]"}`}>{tab}</button>)}
    </div>
  );
}
