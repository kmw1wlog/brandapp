export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-forest/10 bg-cream/85 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">Demo Report</p>
          <p className="text-sm font-semibold text-forest">프랜차이즈 없이 시작하는 F&B 창업 실행안</p>
        </div>
        <span className="rounded-full bg-forest px-4 py-2 text-xs font-bold text-cream">브랜치 베타</span>
      </div>
    </header>
  );
}
