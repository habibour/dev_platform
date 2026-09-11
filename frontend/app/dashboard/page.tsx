"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { AppShell } from "@/components/AppShell";

type SecureHealth = { message: string; user: { userId: string; email: string; role: string } };

export default function DashboardPage() {
  const [result, setResult] = useState<SecureHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch
      .get<SecureHealth>("health/secure")
      .then(setResult)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Request failed"));
  }, []);

  return (
    <AppShell>
      <main className="flex flex-1 justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-xl rounded-md border border-chrome-200 bg-chrome-0 p-5">
          <h1 className="text-base font-semibold text-chrome-900">Dashboard</h1>
          <p className="mt-1 text-sm text-chrome-600">
            This page is protected — reachable only while logged in, and it fetches a
            JWT-guarded backend route through the proxy.
          </p>

          {error && (
            <p className="mt-4 rounded-md bg-like/10 px-3 py-2 text-sm text-like">{error}</p>
          )}
          {result && (
            <pre className="mt-4 rounded-md bg-brand-50 p-4 text-xs text-chrome-800">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </main>
    </AppShell>
  );
}
