export function won(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function percent(value: number) {
  return `${(value * 100).toFixed(value * 100 >= 10 ? 1 : 0)}%`;
}
