import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";

const ONE_DAY_SECONDS = 60 * 60 * 24;

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY_SECONDS,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}
