"use client";

import { Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export function AboutWidget() {
  const { user } = useAuth();

  return (
    <aside className="hidden w-72 shrink-0 self-start pt-4 lg:block">
      <div className="sticky top-20 overflow-hidden rounded-lg border border-chrome-200 bg-chrome-0">
        <div className="flex items-center gap-2 bg-brand-500 px-4 py-3 text-white">
          <Users size={16} />
          <span className="font-semibold">About Dev Community</span>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm text-chrome-600">
            A developer community app — posts, threaded comments, like/dislike reactions, a
            ranked feed, and developer profiles.
          </p>
          {!user && (
            <Link
              href="/signup"
              className="mt-3 block rounded-full border border-brand-500 py-1.5 text-center text-sm font-medium text-brand-500 transition-colors hover:bg-brand-50"
            >
              Log in to post
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
