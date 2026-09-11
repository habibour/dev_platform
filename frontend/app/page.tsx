"use client";

import { useEffect, useState } from "react";
import { AboutWidget } from "@/components/AboutWidget";
import { AppShell } from "@/components/AppShell";

type HealthStatus = "loading" | "connected" | "unreachable";

export default function Home() {
  const [status, setStatus] = useState<HealthStatus>("loading");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiUrl}/health`)
      .then((res) => {
        if (!res.ok) throw new Error("Health check failed");
        return res.json();
      })
      .then(() => setStatus("connected"))
      .catch(() => setStatus("unreachable"));
  }, []);

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
                  status === "connected"
                    ? "bg-brand-500"
                    : status === "unreachable"
                      ? "bg-like"
                      : "bg-chrome-300"
                }`}
              />
              <span className="text-chrome-600">
                {status === "loading" && "Checking API connection…"}
                {status === "connected" && "API connected"}
                {status === "unreachable" && "API unreachable"}
              </span>
            </div>
          </div>
        </main>

        <AboutWidget />
      </div>
    </AppShell>
  );
}
