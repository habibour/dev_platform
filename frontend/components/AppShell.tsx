import type { ReactNode } from "react";
import { LeftNavRail } from "@/components/LeftNavRail";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1">
      <LeftNavRail />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
