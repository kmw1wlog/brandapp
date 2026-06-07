import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  return NextResponse.json({ ok: true, received: true, taskId: payload?.taskId ?? null });
}
