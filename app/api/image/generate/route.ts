import { NextResponse } from "next/server";
import { createKieImage } from "@/lib/image/kieNanoBanana";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createKieImage({
      kind: String(body?.kind ?? "interior"),
      prompt: String(body?.prompt ?? ""),
      referenceImages: Array.isArray(body?.referenceImages) ? body.referenceImages : []
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      ok: true,
      source: "fallback",
      status: "fallback",
      imageUrl: null,
      taskId: null,
      prompt: "",
      error: error instanceof Error ? error.message : "controlled image route error"
    });
  }
}
