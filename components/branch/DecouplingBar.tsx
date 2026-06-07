const items = [
  ["브랜드/로고", "AI 브랜드 설계"],
  ["메뉴/원가", "메뉴 개발 & 원가 계산"],
  ["공급처", "공급처 후보 연결"],
  ["인테리어 콘셉트", "디자인 제안"],
  ["시공 견적 요청서", "표준 RFP 제공"],
  ["오픈 문서", "체크리스트 자동 생성"]
];

export function DecouplingBar() {
  return (
    <section className="mt-6 rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-xl font-black text-[#164033]">프랜차이즈가 해주던 것, 브랜치는 이렇게 대체합니다.</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {items.map(([before, after]) => (
          <div key={before} className="rounded-lg bg-[#f6f1e8] p-4">
            <p className="text-xs font-bold text-[#7a7065]">{before}</p>
            <p className="mt-1 font-black text-[#164033]">{after}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
