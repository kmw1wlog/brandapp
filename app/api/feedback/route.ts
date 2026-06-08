import { NextResponse } from "next/server";
import { saveFeedbackEntry } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await saveFeedbackEntry({
      stage: String(payload.stage ?? payload.page ?? "unknown"),
      blocker: String(payload.blocker ?? payload.message ?? ""),
      feature: String(payload.feature ?? ""),
      consultation: Boolean(payload.consultation),
      contact: payload.contact ? String(payload.contact) : null,
      payload,
      created_at: new Date().toISOString()
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      ok: true,
      source: "mock",
      warning: error instanceof Error ? error.message : "controlled feedback error"
    });
  }
}
