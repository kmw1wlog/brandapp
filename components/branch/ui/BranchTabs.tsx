"use client";

export function BranchTabs<T extends string>({
  items,
  value,
  onChange
}: {
  items: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={`rounded-xl px-3 py-2 text-sm font-black ${value === item.value ? "bg-[color:var(--branch-primary)] text-white" : "border border-[color:var(--branch-border)] bg-white text-[color:var(--branch-ink-muted)]"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
