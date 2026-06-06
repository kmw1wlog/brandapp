export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-forest/60">{label}</p>
      <p className="mt-2 text-2xl font-black text-forest">{value}</p>
      {note ? <p className="mt-2 text-sm text-ink/60">{note}</p> : null}
    </div>
  );
}
