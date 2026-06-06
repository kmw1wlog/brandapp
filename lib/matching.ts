import type { CostIngredient, GroupBuy, Supplier } from "./types";

function normalizedOverlap(a: string[], b: string[]) {
  const left = a.map((item) => item.toLowerCase().replace(/\s/g, ""));
  const right = b.map((item) => item.toLowerCase().replace(/\s/g, ""));
  return left.filter((item) => right.some((candidate) => candidate.includes(item) || item.includes(candidate)));
}

function preferredCategory(ingredient: CostIngredient) {
  if (ingredient.category === "meat" || ingredient.category === "rice" || ingredient.category === "vegetable" || ingredient.category === "sauce") return "food";
  return "packaging";
}

export function matchSuppliersForIngredient(ingredient: CostIngredient, suppliers: Supplier[]) {
  const keywords = ingredient.supplier_keywords?.length ? ingredient.supplier_keywords : [ingredient.name];
  const candidates = suppliers
    .map((supplier) => {
      const overlap = normalizedOverlap(keywords, supplier.keywords);
      const reasons: string[] = [];
      let score = 0;

      if (overlap.length > 0) {
        score += 40;
        reasons.push(`키워드 일치: ${overlap.join(", ")}`);
      }
      if (supplier.region.includes("부산") || supplier.region.includes("전국")) {
        score += 20;
        reasons.push("부산/전국 배송 가능");
      }
      if (supplier.category === preferredCategory(ingredient)) {
        score += 20;
        reasons.push("카테고리 적합");
      }
      if (supplier.delivery_type.length > 0) {
        score += 10;
        reasons.push(`배송: ${supplier.delivery_type.join(", ")}`);
      }
      score += Math.round(supplier.confidence_score * 10);

      return { supplier, score, matchReasons: reasons };
    })
    .filter((candidate) => candidate.score >= 45)
    .sort((a, b) => b.score - a.score);

  return {
    ingredientName: ingredient.name,
    category: ingredient.category ?? "packaging",
    candidates
  };
}

export function matchSuppliersForMenu(menuIngredients: CostIngredient[], suppliers: Supplier[]) {
  return menuIngredients.map((ingredient) => matchSuppliersForIngredient(ingredient, suppliers));
}

export function buildRecommendedSupplierBundle(matches: ReturnType<typeof matchSuppliersForMenu>) {
  return matches
    .map((match) => match.candidates[0])
    .filter(Boolean)
    .map((candidate) => candidate.supplier);
}

export function findGroupBuyCandidates(menuName: string, groupBuys: GroupBuy[]) {
  return groupBuys.filter((groupBuy) => groupBuy.related_menus.includes(menuName) || groupBuy.related_menus.includes("전 메뉴"));
}
