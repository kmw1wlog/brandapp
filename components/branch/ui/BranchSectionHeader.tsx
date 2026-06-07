import type { ReactNode } from "react";

export function BranchSectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.14em] text-[color:var(--branch-accent)]">{eyebrow}</p> : null}
        <h2 className="mt-1 text-2xl font-black text-[color:var(--branch-primary)]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
