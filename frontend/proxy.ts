import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";

export function proxy(request: NextRequest) {
  const hasAuthCookie = request.cookies.has(AUTH_COOKIE_NAME);

  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
