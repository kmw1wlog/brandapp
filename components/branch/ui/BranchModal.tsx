"use client";

import { useEffect, type ReactNode } from "react";

export function BranchModal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="branch-modal-title">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <h2 id="branch-modal-title" className="text-xl font-black text-[color:var(--branch-primary)]">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-black text-[color:var(--branch-ink-muted)] hover:bg-[color:var(--branch-surface-muted)]">닫기</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
