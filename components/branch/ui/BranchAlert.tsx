import type { ReactNode } from "react";

export function BranchAlert({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900">{children}</p>;
}
