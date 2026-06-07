export function BranchMetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--branch-border)] bg-white p-4">
      <p className="text-xs font-bold text-[color:var(--branch-ink-muted)]">{label}</p>
      <p className="mt-1 text-xl font-black text-[color:var(--branch-primary)]">{value}</p>
      {helper ? <p className="mt-1 text-xs text-[color:var(--branch-ink-muted)]">{helper}</p> : null}
    </div>
  );
}
