"use client";

import { useQuery } from "@tanstack/react-query";
import { AboutWidget } from "@/components/AboutWidget";
import { AppShell } from "@/components/AppShell";
import { apiFetch } from "@/lib/api";

type HealthResponse = { api: string; db: string };

export default function Home() {
  const { status, refetch, isFetching } = useQuery({
    queryKey: ["health"],
    queryFn: () => apiFetch.get<HealthResponse>("health"),
    retry: 1,
  });

  return (
    <AppShell>
      <div className="flex flex-1 gap-6 px-4 py-4 sm:px-6">
        <main className="min-w-0 flex-1">
          <h1 className="mb-3 text-xs font-semibold tracking-wide text-chrome-500 uppercase">
            Top posts
          </h1>

          <div className="rounded-md border border-chrome-200 bg-chrome-0 p-5">
            <h2 className="text-base font-semibold text-chrome-900">Welcome to the feed</h2>
            <p className="mt-1 text-sm text-chrome-600">
              Posts, comments, and reactions land here starting Day 4.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "success"
                    ? "bg-brand-500"
                    : status === "error"
                      ? "bg-like"
                      : "bg-chrome-300"
                }`}
              />
              <span className="text-chrome-600">
                {status === "pending" && "Checking API connection…"}
                {status === "success" && "API connected"}
                {status === "error" && "API unreachable"}
              </span>
              {status === "error" && (
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="cursor-pointer rounded-full border border-chrome-200 px-2 py-0.5 text-xs font-medium text-chrome-700 hover:border-brand-500 hover:text-brand-500 disabled:opacity-50"
                >
                  {isFetching ? "Retrying…" : "Retry"}
                </button>
              )}
            </div>
          </div>
        </main>

        <AboutWidget />
      </div>
    </AppShell>
  );
}
