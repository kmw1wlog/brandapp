import type { ReactNode } from "react";

export function BranchTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-56 -translate-x-1/2 rounded-lg bg-[color:var(--branch-ink)] px-3 py-2 text-xs font-bold leading-5 text-white group-hover:block group-focus-within:block">
        {label}
      </span>
    </span>
  );
}
