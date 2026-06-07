"use client";

import type { ReactNode } from "react";

export function BranchDrawer({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/35">
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[color:var(--branch-primary)]">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-black text-[color:var(--branch-ink-muted)]">닫기</button>
        </div>
        <div className="mt-4">{children}</div>
      </aside>
    </div>
  );
}
