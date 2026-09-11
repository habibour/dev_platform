import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthToken } from "@/lib/cookies";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

async function forward(request: NextRequest, path: string[]) {
  const token = await getAuthToken();

  const url = new URL(path.join("/"), `${BACKEND_URL}/`);
  url.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (token) headers.set("authorization", `Bearer ${token}`);

  const hasBody = !["GET", "HEAD"].includes(request.method);

  const backendResponse = await fetch(url, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
  });

  const responseBody = await backendResponse.text();
  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "content-type": backendResponse.headers.get("content-type") ?? "application/json",
    },
  });
}

type ProxyContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, ctx: ProxyContext) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function POST(request: NextRequest, ctx: ProxyContext) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function PATCH(request: NextRequest, ctx: ProxyContext) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function PUT(request: NextRequest, ctx: ProxyContext) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function DELETE(request: NextRequest, ctx: ProxyContext) {
  const { path } = await ctx.params;
  return forward(request, path);
}
