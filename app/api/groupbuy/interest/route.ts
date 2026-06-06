import { NextResponse } from "next/server";
import { saveGroupBuyInterest } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await saveGroupBuyInterest({ ...payload, created_at: new Date().toISOString() });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      ok: true,
      source: "mock",
      warning: error instanceof Error ? error.message : "controlled groupbuy error"
    });
  }
}
