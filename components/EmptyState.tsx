export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-forest/20 bg-white/60 p-6 text-center">
      <p className="font-bold text-forest">{title}</p>
      <p className="mt-2 text-sm text-ink/60">{description}</p>
    </div>
  );
}
