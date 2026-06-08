import type { BrandOption } from "@/lib/branch/types";
import { BrandAssetGallery } from "./BrandAssetGallery";

export function BrandBoardView({ brand }: { brand: BrandOption }) {
  return (
    <div className="grid gap-4">
      <BrandAssetGallery brand={brand} />
    </div>
  );
}
