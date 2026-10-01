"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireEvento } from "./RequireEvento";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <RequireEvento>
        <div className="flex h-screen flex-col overflow-hidden bg-[#FAF7F2] lg:flex-row">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </RequireEvento>
    </RequireAuth>
  );
}