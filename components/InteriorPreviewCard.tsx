export function InteriorPreviewCard({ prompt, imageUrl }: { prompt: string; imageUrl?: string | null }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft">
      <h3 className="text-lg font-black text-forest">인테리어 이미지 프리뷰</h3>
      <div className="mt-4 grid min-h-56 place-items-center rounded-3xl border border-forest/10 bg-[radial-gradient(circle_at_20%_20%,rgba(217,121,56,0.22),transparent_28%),linear-gradient(135deg,#173f35,#2f6b4f)] p-6 text-center text-cream">
        {imageUrl ? (
          <div
            role="img"
            aria-label="생성된 인테리어"
            className="h-72 w-full rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div><p className="text-2xl font-black">이미지 시안 준비 중</p><p className="mt-2 text-sm text-cream/75">이미지 생성 전에는 프롬프트 카드가 표시됩니다.</p></div>
        )}
      </div>
      <p className="mt-4 rounded-2xl bg-cream p-4 text-sm text-forest">{prompt}</p>
    </div>
  );
}
