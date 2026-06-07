import { NextResponse } from "next/server";
import { fetchKieJobStatus } from "@/lib/branch/image/kie-client";

export async function GET(request: Request) {
  const taskId = new URL(request.url).searchParams.get("taskId");
  if (!taskId) return NextResponse.json({ status: "fail", resultUrls: [] }, { status: 400 });
  return NextResponse.json(await fetchKieJobStatus(taskId));
}
