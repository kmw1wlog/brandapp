"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/LoadingState";
import { MenuCard } from "@/components/MenuCard";
import { getMenus } from "@/lib/db/local";
import { saveSelectedMenuId } from "@/lib/storage";
import type { Menu } from "@/lib/types";

export default function MenuPage() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>(getMenus().slice(0, 3));
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("Demo fallback");

  function selectMenu(menuId: string) {
    saveSelectedMenuId(menuId);
    router.push("/dashboard/startup/cost");
  }

  async function regenerate() {
    setLoading(true);
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: "menu_recommendation", context: {} })
    });
    const result = await response.json();
    const nextMenus = result?.data?.recommended_menus;
    setMenus(Array.isArray(nextMenus) ? nextMenus.slice(0, 3) : getMenus().slice(1, 4));
    setSource(result?.source === "qwen" ? "Qwen" : "Demo fallback");
    setLoading(false);
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-bold text-clay">2단계 · AI 생성: {source}</p><h2 className="mt-2 text-3xl font-black text-forest">추천 메뉴</h2></div>
        <button onClick={regenerate} className="rounded-2xl bg-forest px-5 py-3 text-sm font-black text-cream">다른 메뉴 다시 추천</button>
      </div>
      {loading ? <LoadingState label="메뉴 조합을 다시 구성 중입니다" /> : null}
      <div className="grid gap-5 lg:grid-cols-3">
        {menus.map((menu) => (
          <MenuCard
            key={menu.id}
            menu={menu}
            highlighted={menu.id === "menu_001"}
            action={<button onClick={() => selectMenu(menu.id)} className="w-full rounded-2xl bg-clay px-4 py-3 text-sm font-black text-white">이 메뉴로 진행하기</button>}
          />
        ))}
      </div>
    </section>
  );
}
