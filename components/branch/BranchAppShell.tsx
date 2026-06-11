"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, CalendarDays, ChartNoAxesCombined, ClipboardList, FileSignature, Handshake, LayoutDashboard, MapPinned, Store, Truck, Utensils, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { FeedbackFloatingWidget } from "./FeedbackFloatingWidget";
import { trackEvent } from "@/lib/branch/events";

const nav = [
  { label: "창업 플랜", href: "/dashboard/startup/new", icon: ChartNoAxesCombined },
  { label: "조건 입력", href: "/dashboard/startup/input", icon: ClipboardList },
  { label: "브랜드 청사진", href: "/dashboard/startup/brand", icon: Building2 },
  { label: "개점 타임테이블", href: "/dashboard/startup/timetable", icon: CalendarDays },
  { label: "상담 질문지", href: "/dashboard/startup/consultation", icon: Handshake },
  { label: "원클릭 발주", href: "/dashboard/startup/consultation/rfp", icon: FileSignature },
  { label: "메뉴·원가", href: "/dashboard/startup/cost", icon: Utensils },
  { label: "공급처·공동구매", href: "/dashboard/startup/suppliers", icon: Truck },
  { label: "브랜드 비교", href: "/dashboard/startup/franchise", icon: ChartNoAxesCombined },
  { label: "4개월 회계", href: "/dashboard/startup/finance", icon: WalletCards },
  { label: "입지 분석", href: "/dashboard/startup/location", icon: MapPinned },
  { label: "점주 대시보드", href: "/dashboard/startup/owner-preview", icon: LayoutDashboard },
  { label: "점주 전환", href: "/dashboard/startup/owner-conversion", icon: Store }
];

export function BranchAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const currentIndex = nav.findIndex((item) => pathname === item.href);
  const current = currentIndex >= 0 ? nav[currentIndex] : nav[0];
  const prev = currentIndex > 0 ? nav[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < nav.length - 1 ? nav[currentIndex + 1] : undefined;

  useEffect(() => {
    setReady(true);
    trackEvent("page_view");
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[color:var(--branch-bg)] pb-24 text-[color:var(--branch-ink)] lg:pb-0">
      <aside className="border-[color:var(--branch-border)] bg-[color:var(--branch-primary)] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64">
        <div className="px-5 py-5">
          <Link href="/dashboard/startup/new" className="block">
            <p className="text-xs font-semibold text-[#e2b15f]">프랜차이즈 비교 체험데모</p>
            <h1 className="mt-1 text-2xl font-black">브랜치</h1>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:grid lg:overflow-visible">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-max items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                  active ? "bg-white text-[color:var(--branch-primary)]" : "text-white/82 hover:bg-white/10"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mx-5 hidden rounded-lg border border-white/15 p-3 text-sm text-white/78 lg:block">
          샘플 조건 · 업종 변경 시 브랜드/메뉴/수익이 함께 변경
        </div>
      </aside>
      <main className="px-4 py-5 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--branch-border)] bg-white px-4 py-3 shadow-[var(--branch-shadow)]">
            <div>
              <p className="text-xs font-black text-[color:var(--branch-accent)]">STEP {currentIndex + 1 > 0 ? currentIndex + 1 : 1} / {nav.length}</p>
              <p className="mt-1 font-black text-[color:var(--branch-primary)]">{current.label}</p>
            </div>
            <div className="flex gap-2">
              {prev ? <Link href={prev.href} className="rounded-xl border border-[color:var(--branch-border)] px-3 py-2 text-sm font-black text-[color:var(--branch-ink-muted)]">이전</Link> : null}
              {next ? <Link href={next.href} className="rounded-xl bg-[color:var(--branch-primary)] px-3 py-2 text-sm font-black text-white">다음: {next.label}</Link> : null}
            </div>
          </div>
          {ready ? <div data-testid="branch-ready" /> : null}
          {children}
        </div>
      </main>
      {next ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--branch-border)] bg-white/95 p-3 backdrop-blur lg:hidden">
          <Link href={next.href} className="block rounded-xl bg-[color:var(--branch-primary)] px-4 py-3 text-center text-sm font-black text-white">다음 단계: {next.label}</Link>
        </div>
      ) : null}
      <FeedbackFloatingWidget />
    </div>
  );
}
