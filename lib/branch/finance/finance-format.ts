export function formatWon(value: number) {
  if (!Number.isFinite(value)) return "0원";
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function formatManwon(value: number) {
  if (!Number.isFinite(value)) return "0만원";
  return `${Math.round(value / 10_000).toLocaleString("ko-KR")}만원`;
}

export function formatPercentValue(value: number) {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.round(value * 100)}%`;
}
