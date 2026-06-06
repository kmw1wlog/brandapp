"use client";

import { useEffect, useState } from "react";
import { GroupBuyCard } from "@/components/GroupBuyCard";
import { getGroupBuysByMenu } from "@/lib/db/local";
import { getGroupBuyInterest, saveGroupBuyInterestLocal } from "@/lib/storage";
import { won } from "@/lib/format";

export default function GroupBuyPage() {
  const groupBuys = getGroupBuysByMenu("우삼겹 덮밥");
  const main = groupBuys[0];
  const [interested, setInterested] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => setInterested(getGroupBuyInterest()), []);

  async function register() {
    const response = await fetch("/api/groupbuy/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupBuyId: main.id, region: "부산", menu: "우삼겹 덮밥", expectedMonthlyQuantity: "20kg" })
    });
    const result = await response.json();
    setInterested(true);
    saveGroupBuyInterestLocal(true);
    setMessage(result?.source === "supabase" ? "Supabase에 관심 등록되었습니다." : "데모 관심 등록이 완료되었습니다.");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-6">
        <div><p className="text-sm font-bold text-clay">7단계</p><h2 className="mt-2 text-3xl font-black text-forest">공동구매</h2><p className="mt-2 text-ink/60">실제 결제 없이 관심 등록만 받는 데모입니다.</p></div>
        <GroupBuyCard groupBuy={main} />
        <div className="rounded-3xl bg-white p-5 shadow-soft">
          <h3 className="text-xl font-black text-forest">다른 공동구매 후보 재료</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {groupBuys.slice(1).map((item) => <div key={item.id} className="rounded-2xl bg-cream p-4 text-sm font-bold text-forest">{item.item_name}<br />{item.current_buyers}/{item.target_buyers}명 참여</div>)}
          </div>
        </div>
      </div>
      <aside className="rounded-3xl bg-forest p-6 text-cream shadow-soft">
        <h3 className="text-2xl font-black">내 매장 참여 정보</h3>
        <div className="mt-5 grid gap-3 text-sm">
          <p>지역: 부산</p><p>메뉴: 우삼겹 덮밥</p><p>예상 필요량: 20kg/月</p><p>예상 단가: 15,800원/kg</p><p>참여 시 예상 단가: 13,430~14,536원/kg</p><p>예상 월 절감액: {won(52000)}</p><p>마감일까지 남은 시간: 6일 12시간</p>
        </div>
        <button onClick={register} className="mt-6 w-full rounded-2xl bg-clay px-5 py-4 text-sm font-black text-white">{interested ? "관심 등록 완료" : "공동구매 관심 등록"}</button>
        <button className="mt-3 w-full rounded-2xl bg-white/10 px-5 py-4 text-sm font-black text-cream">참여자에게 문의 보내기</button>
        {message ? <p className="mt-4 rounded-2xl bg-white/10 p-3 text-sm font-bold">{message}</p> : null}
      </aside>
    </section>
  );
}
