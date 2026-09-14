"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const baseLinks = [{ href: "/", label: "Home", icon: House }];

export function LeftNavRail() {
  const pathname = usePathname();
  const { user } = useAuth();
  const items = user
    ? [
        ...baseLinks,
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: `/profile/${user.id}`, label: "Profile", icon: User },
      ]
    : baseLinks;

  return (
    <nav className="sticky top-16 hidden h-fit w-48 shrink-0 flex-col gap-1 self-start px-3 py-4 md:flex">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-brand-50 text-brand-700" : "text-chrome-700 hover:bg-chrome-100"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
