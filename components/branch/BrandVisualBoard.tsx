import type { BrandOption } from "@/lib/branch/types";
import { BrandAssetGallery } from "./assets/BrandAssetGallery";

export function BrandVisualBoard({ brand }: { brand: BrandOption }) {
  return <BrandAssetGallery brand={brand} compact />;
}
