export function OperationCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft">
      <h3 className="text-xl font-black text-forest">{title}</h3>
      <div className="mt-4 text-sm leading-6 text-ink/75">{children}</div>
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
