"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OperationCard } from "@/components/OperationCard";
import { getFallbackDeliveryCopy, getFallbackHiringPost, getFallbackShortformPlan } from "@/lib/ai/fallback";
import { getChecklistState, saveChecklistState } from "@/lib/storage";

const checklist = ["직원 채용", "포장재 발주", "배달앱 등록", "네이버 플레이스 소개문", "오픈 이벤트", "공동구매 관심 등록"];

export default function OperationPage() {
  const hiring = getFallbackHiringPost();
  const delivery = getFallbackDeliveryCopy();
  const shortform = getFallbackShortformPlan();
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => setChecks(getChecklistState()), []);

  function toggle(item: string) {
    const next = { ...checks, [item]: !checks[item] };
    setChecks(next);
    saveChecklistState(next);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold text-clay">6단계</p><h2 className="mt-2 text-3xl font-black text-forest">직원·배달·홍보 실행안</h2></div>
          <Link href="/dashboard/startup/groupbuy" className="rounded-2xl bg-clay px-5 py-3 text-sm font-black text-white">공동구매로 이동</Link>
        </div>
        <OperationCard title="직원 공고문" action={<button onClick={() => copy(`${hiring.title}\n${hiring.intro}\n${hiring.hours}\n${hiring.wage}\n${hiring.apply}`)} className="rounded-2xl bg-forest px-4 py-3 text-sm font-black text-cream">공고문 복사</button>}>
          <p className="font-black">{hiring.title}</p><p>{hiring.intro}</p><p>근무시간: {hiring.hours}</p><p>시급: {hiring.wage}</p><p>업무내용: {hiring.duties.join(", ")}</p><p>우대사항: {hiring.preferred.join(", ")}</p><p>지원방법: {hiring.apply}</p>
        </OperationCard>
        <OperationCard title="배달 운영안" action={<div className="flex flex-wrap gap-3"><button onClick={() => copy(delivery.intro)} className="rounded-2xl bg-forest px-4 py-3 text-sm font-black text-cream">배달 문구 복사</button><button className="rounded-2xl bg-cream px-4 py-3 text-sm font-black text-forest">배달 설정 저장</button></div>}>
          <p>배달 메뉴명: {delivery.menu_name}</p><p>포장 권장사항: {delivery.packaging}</p><p>배달앱 소개문: {delivery.intro}</p><p>리뷰 이벤트: {delivery.review_event}</p><p>배달 안내: {delivery.notice}</p><p>배달대행 연결 상태: {delivery.partner_status}</p>
        </OperationCard>
        <OperationCard title="릴스/쇼츠 홍보안" action={<div className="flex flex-wrap gap-3"><button className="rounded-2xl bg-clay px-4 py-3 text-sm font-black text-white">홍보처 연결하기</button><button onClick={() => copy(`${shortform.concept}\n${shortform.hook}\n${shortform.visual}\n${shortform.offer}\n${shortform.cta}`)} className="rounded-2xl bg-forest px-4 py-3 text-sm font-black text-cream">릴스 기획안 복사</button></div>}>
          <p>콘셉트: {shortform.concept}</p><p>{shortform.hook}</p><p>{shortform.visual}</p><p>{shortform.offer}</p><p>{shortform.cta}</p><p>캡션: {shortform.caption}</p><p>해시태그: {shortform.hashtags.join(" ")}</p><p>외주자 작업 지시문: {shortform.brief}</p>
        </OperationCard>
      </div>
      <aside className="rounded-3xl bg-white p-5 shadow-soft">
        <h3 className="text-xl font-black text-forest">오픈 체크리스트</h3>
        <div className="mt-5 grid gap-3">
          {checklist.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-cream p-3 text-sm font-bold text-forest">
              <input type="checkbox" checked={Boolean(checks[item])} onChange={() => toggle(item)} />
              {item}
            </label>
          ))}
        </div>
      </aside>
    </section>
  );
}
