import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/cookies";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function GET() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: "Not authenticated", errors: [] },
      { status: 401 },
    );
  }

  const backendResponse = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { authorization: `Bearer ${token}` },
  });

  const payload = await backendResponse.json();
  return NextResponse.json(payload, { status: backendResponse.status });
}
