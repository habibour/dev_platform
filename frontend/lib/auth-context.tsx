"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

type Envelope<T> =
  | { success: true; data: T }
  | { success: false; statusCode: number; message: string; errors: unknown[] };

async function postAuth(path: string, body: unknown): Promise<AuthUser> {
  const res = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await res.json()) as Envelope<{ user: AuthUser }>;

  if (!payload.success) {
    throw new Error(payload.message);
  }

  return payload.data.user;
}

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const payload = (await res.json()) as Envelope<{ user: AuthUser }>;
        if (!cancelled) setUser(payload.success ? payload.data.user : null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await postAuth("login", { email, password });
    setUser(loggedInUser);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const newUser = await postAuth("signup", { name, email, password });
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
