export function LoadingState({ label = "처리 중입니다" }: { label?: string }) {
  return <div className="rounded-2xl bg-cream px-4 py-3 text-sm font-bold text-forest">{label}</div>;
}
