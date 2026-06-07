"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, CalendarDays, ChartNoAxesCombined, ClipboardList, FileText, Handshake, LayoutDashboard, MapPinned } from "lucide-react";
import { useEffect } from "react";
import { FeedbackFloatingWidget } from "./FeedbackFloatingWidget";
import { trackEvent } from "@/lib/branch/events";

const nav = [
  { label: "비교", href: "/dashboard/startup/new", icon: ChartNoAxesCombined },
  { label: "브랜드 실행안", href: "/dashboard/startup/brand", icon: Building2 },
  { label: "메뉴·원가", href: "/dashboard/startup/cost", icon: ClipboardList },
  { label: "공급처·입지", href: "/dashboard/startup/suppliers", icon: MapPinned },
  { label: "시공 요구사항서", href: "/dashboard/startup/build", icon: FileText },
  { label: "개점 타임테이블", href: "/dashboard/startup/timetable", icon: CalendarDays },
  { label: "상담신청", href: "/dashboard/startup/consultation", icon: Handshake },
  { label: "점주 미리보기", href: "/dashboard/startup/owner-preview", icon: LayoutDashboard }
];

export function BranchAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view");
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-[#231f1a]">
      <aside className="border-[#ddd2c0] bg-[#164033] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64">
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
                  active ? "bg-white text-[#164033]" : "text-white/82 hover:bg-white/10"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mx-5 hidden rounded-lg border border-white/15 p-3 text-sm text-white/78 lg:block">
          부산 대학가 · 5,000만원 · 고기덮밥 비교
        </div>
      </aside>
      <main className="px-4 py-5 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <FeedbackFloatingWidget />
    </div>
  );
}
