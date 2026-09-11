"use client";

import Link from "next/link";
import { CodeXml } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-chrome-200 bg-chrome-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <CodeXml size={18} strokeWidth={2.5} />
            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-brand-100" />
          </span>
          <span className="text-lg font-bold">
            <span className="text-chrome-900">dev</span>{" "}
            <span className="text-brand-500">community</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm sm:gap-4">
          {loading ? null : user ? (
            <>
              <span className="hidden text-chrome-600 sm:inline">
                {user.email} <span className="text-brand-600">({user.role})</span>
              </span>
              <button
                type="button"
                onClick={() => void logout()}
                className="cursor-pointer whitespace-nowrap rounded-full border border-chrome-200 px-3.5 py-1.5 font-medium text-chrome-600 transition-colors hover:bg-chrome-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap text-chrome-600 transition-colors hover:text-chrome-900"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="whitespace-nowrap rounded-full bg-brand-500 px-3.5 py-1.5 font-medium text-white transition-colors hover:bg-brand-600"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
