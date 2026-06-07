export function slugifyKorean(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w가-힣]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function normalizeProductUrl(url: string | null | undefined) {
  if (!url) return null;
  return url.trim().replace(/\/+$/, "");
}

export function median(values: number[]) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function average(values: number[]) {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function parseManwonToWon(text: string) {
  const match = text.replace(/\s+/g, " ").match(/([\d,]+)\s*만원/);
  return match ? Math.round(Number(match[1].replace(/,/g, "")) * 10000) : null;
}

export function parseNumericText(text: string) {
  const match = text.match(/([\d,]+)/);
  return match ? Number(match[1].replace(/,/g, "")) : null;
}
