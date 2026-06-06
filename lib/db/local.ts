import brandReferences from "@/src/data/brandReferences.json";
import groupBuys from "@/src/data/groupBuys.json";
import menus from "@/src/data/menus.json";
import prompts from "@/src/data/prompts.json";
import screenCopy from "@/src/data/screenCopy.json";
import suppliers from "@/src/data/suppliers.json";
import woosamgyupDetail from "@/src/data/woosamgyupDetail.json";
import { DEMO_SCENARIO } from "@/lib/constants";
import type { BrandReference, GroupBuy, Menu, Supplier, WoosamgyupDetail } from "@/lib/types";

export function getStartupScenario() {
  return DEMO_SCENARIO;
}

export function getMenus(): Menu[] {
  return menus as Menu[];
}

export function getMenuById(menuId: string): Menu {
  return getMenus().find((menu) => menu.id === menuId) ?? getMenus()[0];
}

export function getSuppliers(): Supplier[] {
  return suppliers as Supplier[];
}

export function getSuppliersByKeywords(keywords: string[]): Supplier[] {
  const normalized = keywords.map((keyword) => keyword.toLowerCase());
  return getSuppliers().filter((supplier) =>
    supplier.keywords.some((keyword) => normalized.some((item) => keyword.toLowerCase().includes(item) || item.includes(keyword.toLowerCase())))
  );
}

export function getWoosamgyupDetail(): WoosamgyupDetail {
  return woosamgyupDetail as WoosamgyupDetail;
}

export function getGroupBuys(): GroupBuy[] {
  return groupBuys as GroupBuy[];
}

export function getGroupBuysByMenu(menuName: string): GroupBuy[] {
  return getGroupBuys().filter((groupBuy) => groupBuy.related_menus.includes(menuName) || groupBuy.related_menus.includes("전 메뉴"));
}

export function getBrandReferences(): BrandReference[] {
  return brandReferences as BrandReference[];
}

export function getScreenCopy(screen: keyof typeof screenCopy) {
  return screenCopy[screen];
}

export function getPromptTemplate(task: keyof typeof prompts) {
  return prompts[task];
}
