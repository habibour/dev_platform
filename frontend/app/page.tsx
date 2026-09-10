"use client";

import { useEffect, useState } from "react";

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
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Dev Community</h1>
      <p className="text-sm text-gray-500">
        {status === "loading" && "Checking API connection…"}
        {status === "connected" && "✅ API connected"}
        {status === "unreachable" && "❌ API unreachable"}
      </p>
    </main>
  );
}
