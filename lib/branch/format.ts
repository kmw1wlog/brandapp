export function formatKRW(value: number | null | undefined) {
  if (value == null) return "확인 필요";
  if (Math.abs(value) >= 100000000) return `${(value / 100000000).toFixed(1).replace(".0", "")}억원`;
  if (Math.abs(value) >= 10000) return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function formatPercent(value: number | null | undefined) {
  if (value == null) return "확인 필요";
  return `${value > 1 ? value.toFixed(0) : (value * 100).toFixed(1)}%`;
}

export function formatRange(min: number | null | undefined, max: number | null | undefined) {
  if (min == null && max == null) return "확인 필요";
  if (min == null) return `~${formatKRW(max)}`;
  if (max == null) return `${formatKRW(min)}~`;
  return `${formatKRW(min)}~${formatKRW(max)}`;
}

export function formatScore(value: number | null | undefined) {
  if (value == null) return "확인 필요";
  return `${value}/10`;
}
