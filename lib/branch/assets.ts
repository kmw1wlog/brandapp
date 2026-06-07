import brandAssetManifest from "@/src/data/branch/assets/brand_asset_manifest.json";
import type { BrandAsset, BrandAssetKind } from "./types";

const kindLabels: Record<BrandAssetKind, string> = {
  storefront: "외관",
  interior: "인테리어",
  logo: "로고",
  signature_menu: "대표 메뉴",
  menu_board: "메뉴판",
  packaging: "패키지",
  delivery_thumbnail: "배달앱 썸네일",
  promotion: "홍보 이미지"
};

export function getBrandAssets(brandId: string) {
  return (brandAssetManifest as BrandAsset[]).filter((asset) => asset.brandId === brandId);
}

export function getHeroAsset(brandId: string) {
  return getBrandAssets(brandId)[0] ?? (brandAssetManifest as BrandAsset[])[0];
}

export function getAssetKindLabel(kind: BrandAssetKind) {
  return kindLabels[kind];
}
