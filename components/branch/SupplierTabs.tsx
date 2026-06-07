"use client";

export function SupplierTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const tabs = ["검증 상품", "가격 확인 필요", "추가 확인 후보", "제외된 URL", "공동구매 후보"];
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((tab) => <button key={tab} type="button" onClick={() => onChange(tab)} className={`rounded-lg px-4 py-2 text-sm font-black ${value === tab ? "bg-[#164033] text-white" : "bg-white text-[#574d42]"}`}>{tab}</button>)}
    </div>
  );
}
