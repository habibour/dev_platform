import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { getAuthToken } from "@/lib/cookies";

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
