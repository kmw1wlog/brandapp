"use client";

import Link from "next/link";
import { Bell, CalendarDays, Check, ChevronRight, ClipboardList, FileText, Hammer, MapPin, MessageSquareText, PartyPopper, Truck, Users } from "lucide-react";
import { BusinessBlueprintCard, ConceptImage, useDemoExperience } from "@/components/branch/DemoExperience";
import { generateTimetable } from "@/lib/branch/timetable/generate-timetable";
import { daysUntilOpening, resolveOpeningTargetDate } from "@/lib/branch/user-input";

const quickActions = [
  { title: "질문지 만들기", desc: "상담/문의에 사용할 질문지를 브랜치가 도와드려요", href: "/dashboard/startup/consultation", icon: MessageSquareText, tone: "green" },
  { title: "상담 예약하기", desc: "시공사, 세무사, 공급처 등 전문가 상담을 예약하세요", href: "/dashboard/startup/consultation/status", icon: CalendarDays, tone: "gold" },
  { title: "견적 요청문 복사", desc: "공급처/시공사에 보낼 요청문을 바로 복사하세요", href: "/dashboard/startup/consultation/rfp", icon: FileText, tone: "blue" }
];

export default function TimetablePage() {
  const { input, simulation } = useDemoExperience();
  const generated = generateTimetable(input.opening_target);
  const targetDate = resolveOpeningTargetDate(input.opening_target);
  const remainingDays = daysUntilOpening(input.opening_target);
  const tasks = generated.tasks.slice(0, 10);
  const doneCount = 2;

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-[#e4dacb] bg-white p-5 shadow-[0_18px_50px_rgba(61,45,27,0.06)]">
        <div>
          <p className="text-sm font-black text-[#0f7b54]">생성 완료</p>
          <h2 className="mt-2 text-4xl font-black text-[#211f1a]">{simulation.virtualBrand.name}</h2>
          <p className="mt-2 text-sm font-bold text-[#6a6258]">{input.region} · {simulation.category.display_name} · 목표 오픈일 {targetDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/startup/brand" className="rounded-xl border border-[#e4dacb] bg-white px-4 py-3 text-sm font-black text-[#4a2a18]">다른 이름으로 저장</Link>
          <button type="button" className="rounded-full border border-[#e4dacb] bg-white p-3 text-[#073d2d]"><Bell size={20} /></button>
        </div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr_0.8fr]">
        <aside className="rounded-[28px] border border-[#e4dacb] bg-white p-5 shadow-[0_18px_50px_rgba(61,45,27,0.06)]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#2b1e16]">완성된 브랜드 콘셉트</h3>
            <span className="rounded-full bg-[#e7f4ed] px-3 py-1 text-xs font-black text-[#0f7b54]">완료</span>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-[#7b6a59]">{simulation.virtualBrand.tagline}</p>
            <h4 className="mt-5 text-5xl font-black text-[#2b1e16]">{simulation.virtualBrand.name}</h4>
            <p className="mx-auto mt-5 max-w-sm text-sm font-bold leading-7 text-[#6a6258]">
              매일 신선한 재료를 준비해 정확한 가격으로 든든한 한 끼를 제공하는 {simulation.category.display_name} 브랜드
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {simulation.imageTemplates.slice(0, 4).map((template, index) => (
              <ConceptImage key={template.template_id} src={template.image_path} alt={template.visual_concept} label={["간판", "메뉴", "인테리어", "패키지"][index]} />
            ))}
          </div>
          <Link href="/dashboard/startup/brand" className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#e4dacb] px-4 py-3 text-sm font-black text-[#4a2a18]">
            브랜드 콘셉트 상세 보기 <ChevronRight size={16} />
          </Link>
        </aside>

        <main className="rounded-[28px] border border-[#e4dacb] bg-white p-5 shadow-[0_18px_50px_rgba(61,45,27,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-2xl font-black text-[#2b1e16]">D-{remainingDays} 오픈 타임라인</h3>
              <p className="mt-1 text-sm font-bold text-[#7b6a59]">목표 오픈일 {targetDate} · {generated.variantLabel}</p>
            </div>
            <span className="rounded-full bg-[#fff3d8] px-4 py-2 text-sm font-black text-[#7d4e13]">D-{remainingDays}</span>
          </div>
          <div className="mt-6 grid gap-1">
            {tasks.map((task, index) => {
              const status = index < doneCount ? "완료" : index < 4 ? "진행중" : index === tasks.length - 1 ? "예정" : "대기";
              return (
                <Link
                  key={task.id}
                  href={task.requires_consultation ? "/dashboard/startup/consultation" : "/dashboard/startup/timetable"}
                  className="group grid grid-cols-[72px_42px_1fr_auto] items-center gap-3 border-b border-[#f0e7d9] py-4 last:border-0"
                >
                  <div className="text-sm font-black text-[#0f7b54]">{task.day}</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f4ed] text-[#0f7b54]">{taskIcon(task.category)}</div>
                  <div>
                    <h4 className="font-black text-[#2b1e16] group-hover:text-[#0f7b54]">{task.title}</h4>
                    <p className="mt-1 text-sm font-bold text-[#7b6a59]">{task.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${status === "완료" ? "bg-[#e7f4ed] text-[#0f7b54]" : status === "진행중" ? "bg-[#fff3d8] text-[#7d4e13]" : "bg-[#eef3f7] text-[#687789]"}`}>{status}</span>
                </Link>
              );
            })}
          </div>
          <Link href="/dashboard/startup/consultation" className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#e4dacb] px-4 py-3 text-sm font-black text-[#4a2a18]">
            전체 타임라인과 상담 질문지 보기 <ChevronRight size={16} />
          </Link>
        </main>

        <aside className="grid gap-5">
          <section className="rounded-[28px] border border-[#e4dacb] bg-white p-5 shadow-[0_18px_50px_rgba(61,45,27,0.06)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-[#2b1e16]">오늘 해야 할 일</h3>
              <span className="text-sm font-black text-[#0f7b54]">2/3 완료</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#edf1ec]"><div className="h-full w-2/3 rounded-full bg-[#0f7b54]" /></div>
            <div className="mt-5 grid gap-4">
              <Todo checked title="상권 분석 리포트 확인" desc="반경 1km 상권 데이터 확인하기" href="/dashboard/startup/location" />
              <Todo checked title="예상 매출 시뮬레이션" desc="월별 매출/비용 시뮬레이션 확인" href="/dashboard/startup/finance" />
              <Todo title="시공사 1차 상담 예약" desc="관심 시공사 상담 일정 잡기" href="/dashboard/startup/consultation" />
            </div>
          </section>

          <section className="grid gap-3">
            <h3 className="text-xl font-black text-[#2b1e16]">바로 시작할 수 있어요</h3>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href} className="flex items-center justify-between rounded-2xl border border-[#e4dacb] bg-white p-4 shadow-[0_10px_25px_rgba(61,45,27,0.05)]">
                  <span className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3faf6] text-[#0f7b54]"><Icon size={21} /></span>
                    <span>
                      <span className="block font-black text-[#2b1e16]">{action.title}</span>
                      <span className="mt-1 block text-xs font-bold text-[#7b6a59]">{action.desc}</span>
                    </span>
                  </span>
                  <ChevronRight size={18} />
                </Link>
              );
            })}
          </section>

          <section className="rounded-[28px] border border-[#e4dacb] bg-white p-5">
            <h3 className="text-xl font-black text-[#2b1e16]">브랜치 추천 파트너</h3>
            <div className="mt-4 rounded-2xl border border-[#eadfce] p-4">
              <p className="font-black text-[#2b1e16]">식담</p>
              <p className="mt-1 text-sm font-bold text-[#7b6a59]">식당 전문 시공 · 20년 경력 맞춤 시공</p>
              <button type="button" className="mt-3 rounded-xl border border-[#e4dacb] px-4 py-2 text-sm font-black text-[#4a2a18]">상담 예약</button>
            </div>
          </section>
        </aside>
      </section>

      <BusinessBlueprintCard input={input} simulation={simulation} />
    </div>
  );
}

function taskIcon(category: string) {
  if (category.includes("시공")) return <Hammer size={19} />;
  if (category.includes("공급")) return <Truck size={19} />;
  if (category.includes("상권") || category.includes("입지")) return <MapPin size={19} />;
  if (category.includes("상담")) return <Users size={19} />;
  if (category.includes("오픈")) return <PartyPopper size={19} />;
  return <ClipboardList size={19} />;
}

function Todo({ checked = false, title, desc, href }: { checked?: boolean; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="grid grid-cols-[26px_1fr_auto] items-center gap-3 border-b border-[#f0e7d9] pb-4 last:border-0 last:pb-0">
      <span className={`flex h-6 w-6 items-center justify-center rounded-md ${checked ? "bg-[#0f7b54] text-white" : "border border-[#cfd8d1] bg-white text-transparent"}`}>
        <Check size={15} />
      </span>
      <span>
        <span className="block font-black text-[#2b1e16]">{title}</span>
        <span className="mt-1 block text-xs font-bold text-[#7b6a59]">{desc}</span>
      </span>
      <span className="rounded-xl border border-[#e4dacb] px-3 py-2 text-xs font-black text-[#4a2a18]">{checked ? "다시 보기" : "바로가기"}</span>
    </Link>
  );
}
