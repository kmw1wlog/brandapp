import Link from "next/link";
import { BarChart3, Megaphone, Package, ReceiptText, ShoppingBasket, Sparkles } from "lucide-react";

const items = [
  { label: "홈", href: "/dashboard/startup/new", icon: BarChart3 },
  { label: "창업안 만들기", href: "/dashboard/startup/new", icon: Sparkles },
  { label: "메뉴 분석", href: "/dashboard/startup/menu", icon: ReceiptText },
  { label: "공급처", href: "/dashboard/startup/suppliers", icon: Package },
  { label: "공동구매", href: "/dashboard/startup/groupbuy", icon: ShoppingBasket },
  { label: "홍보센터", href: "/dashboard/startup/operation", icon: Megaphone }
];

export function Sidebar() {
  return (
    <aside className="border-forest/10 bg-forest p-5 text-cream lg:min-h-screen">
      <Link href="/dashboard/startup/new" className="block rounded-3xl bg-white/10 p-4">
        <p className="text-sm text-cream/70">AI F&B 실행 리포트</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight">브랜치</h1>
      </Link>
      <nav className="mt-8 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href + item.label} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-cream/85 transition hover:bg-white/10 hover:text-white">
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 rounded-3xl bg-clay p-4 text-sm font-semibold text-white shadow-soft">
        부산 대학가 · 5,000만원 · 우삼겹 덮밥 데모
      </div>
    </aside>
  );
}
