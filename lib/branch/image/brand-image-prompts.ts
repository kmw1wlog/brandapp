import type { BrandAssetKind } from "./kie-types";

export function buildBrandImagePrompt(brandName: string, kind: BrandAssetKind) {
  if (kind === "storefront") {
    return `Korean fast-casual meat rice bowl restaurant storefront for brand "${brandName}". Warm dark brown wood, amber lighting, round Korean logo sign, compact university-area storefront, delivery pickup visible, not a barbecue grill restaurant. Create a realistic storefront concept image for a startup execution report. No existing brand logos, no famous trademarks.`;
  }
  if (kind === "interior") {
    return `Interior concept for a small 12-18 pyeong Korean meat rice bowl restaurant named "${brandName}". Solo seats, two-person tables, pickup shelf near entrance, warm wood, dark brown, amber lighting, efficient kitchen counter, fast lunch and delivery flow. Realistic commercial interior rendering.`;
  }
  if (kind === "signature_menu") {
    return `Realistic hero food photo for "우삼겹 덮밥". Thin sliced beef belly over warm rice, green onion, onion, savory soy-based sauce, simple Korean bowl presentation, delivery-app thumbnail quality, appetizing but realistic.`;
  }
  if (kind === "packaging") {
    return `Takeout packaging concept for Korean meat rice bowl brand "${brandName}". Kraft sleeve, dark brown label, round logo sticker, rice bowl container, delivery bag, simple premium fast-casual design.`;
  }
  return `Brand concept image for "${brandName}" ${kind}. Realistic Korean fast casual startup concept.`;
}
