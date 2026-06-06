import { NextResponse } from "next/server";
import { getKieImageStatus } from "@/lib/image/kieNanoBanana";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json(await getKieImageStatus(String(body?.taskId ?? "")));
  } catch {
    return NextResponse.json({ ok: true, status: "failed", imageUrl: null });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json(await getKieImageStatus(searchParams.get("taskId") ?? ""));
}
