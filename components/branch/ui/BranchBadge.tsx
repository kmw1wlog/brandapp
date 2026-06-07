import type { ReactNode } from "react";

type Tone = "default" | "success" | "warning" | "danger" | "info";

const toneClass: Record<Tone, string> = {
  default: "border-[color:var(--branch-border)] bg-[color:var(--branch-surface-muted)] text-[color:var(--branch-ink)]",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-800"
};

export function BranchBadge({ children, tone = "default" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black ${toneClass[tone]}`}>{children}</span>;
}
