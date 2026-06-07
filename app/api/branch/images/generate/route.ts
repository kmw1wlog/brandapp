import { NextResponse } from "next/server";
import { buildBrandImagePrompt } from "@/lib/branch/image/brand-image-prompts";
import { createKieBrandImageJob } from "@/lib/branch/image/kie-client";
import type { BrandAssetKind } from "@/lib/branch/image/kie-types";

export async function POST(request: Request) {
  const body = await request.json();
  const brandId = String(body?.brandId ?? "brand_yukbanjang");
  const brandName = String(body?.brandName ?? "육반장");
  const kind = String(body?.kind ?? "storefront") as BrandAssetKind;
  const templateUrl = String(body?.templateUrl ?? "");
  const prompt = buildBrandImagePrompt(brandName, kind);
  const job = await createKieBrandImageJob({ brandId, kind, templateUrl, prompt });
  return NextResponse.json(job);
}
