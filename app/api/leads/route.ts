import { NextResponse } from "next/server";
import { saveLead } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await saveLead({ ...payload, created_at: new Date().toISOString() });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      ok: true,
      source: "mock",
      warning: error instanceof Error ? error.message : "controlled lead error"
    });
  }
}
