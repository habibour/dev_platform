import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/cookies";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  const body = await request.text();

  const backendResponse = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

  const payload = await backendResponse.json();

  if (!backendResponse.ok || !payload.success) {
    return NextResponse.json(payload, { status: backendResponse.status });
  }

  await setAuthCookie(payload.data.accessToken);

  return NextResponse.json(
    { success: true, data: { user: payload.data.user } },
    { status: backendResponse.status },
  );
}
