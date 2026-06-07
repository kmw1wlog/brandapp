export function BranchEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--branch-border)] bg-white p-6 text-center">
      <p className="font-black text-[color:var(--branch-primary)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--branch-ink-muted)]">{description}</p>
    </div>
  );
}
