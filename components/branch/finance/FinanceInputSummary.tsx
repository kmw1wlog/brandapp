"use client";

import Link from "next/link";
import { formatManwon, formatPercentValue } from "@/lib/branch/finance/finance-format";
import type { StartupUserInput } from "@/lib/branch/finance/finance-types";

export function FinanceInputSummary({ input }: { input: StartupUserInput }) {
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[#164033]">입력 요약</h3>
          <p className="mt-1 text-sm font-bold text-[#655d52]">{input.region} · {input.category} · {input.operation_type}</p>
        </div>
        <Link href="/dashboard/startup/input" className="rounded-lg border border-[#cbbda8] px-3 py-2 text-sm font-black text-[#574d42]">입력 수정</Link>
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
        <Metric label="창업 예산" value={formatManwon(input.budget)} />
        <Metric label="자기자본/대출" value={`${formatManwon(input.capital_structure.own_capital)} / ${formatManwon(input.capital_structure.loan_amount)}`} />
        <Metric label="목표 월소득" value={formatManwon(input.target_owner_income)} />
        <Metric label="배달 비중" value={formatPercentValue(input.delivery_share ?? 0.45)} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f6f1e8] p-3"><p className="text-xs font-bold text-[#7a7065]">{label}</p><p className="mt-1 font-black text-[#164033]">{value}</p></div>;
}
