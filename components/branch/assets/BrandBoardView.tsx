import type { BrandOption } from "@/lib/branch/types";
import { BrandHeroImage } from "./BrandHeroImage";
import { BrandAssetGallery } from "./BrandAssetGallery";

export function BrandBoardView({ brand }: { brand: BrandOption }) {
  return (
    <div className="grid gap-4">
      <BrandHeroImage brand={brand} />
      <BrandAssetGallery brand={brand} />
    </div>
  );
}
