"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatManwon } from "@/lib/branch/finance/finance-format";
import type { StartupUserInput } from "@/lib/branch/finance/finance-types";
import { readStartupInput } from "@/lib/branch/storage/startup-flow-storage";
import { defaultStartupInput } from "@/lib/branch/user-input";

export function StartupInputSummary() {
  const [input, setInput] = useState<StartupUserInput>(defaultStartupInput);
  useEffect(() => setInput(readStartupInput()), []);
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#ddd2c0] bg-white px-4 py-3">
      <div className="flex flex-wrap gap-2 text-sm font-bold text-[#164033]">
        <span>예산 {formatManwon(input.budget)}</span>
        <span>지역 {input.region}</span>
        <span>업종 {input.category}</span>
        <span>운영 {input.operation_type}</span>
      </div>
      <Link href="/dashboard/startup/input" className="rounded-md border border-[#cbbda8] px-3 py-2 text-sm font-bold text-[#574d42]">입력 수정</Link>
    </div>
  );
}
