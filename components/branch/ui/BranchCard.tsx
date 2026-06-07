import type { ReactNode } from "react";

export function BranchCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[color:var(--branch-border)] bg-white p-5 shadow-[var(--branch-shadow)] ${className}`}>{children}</section>;
}
