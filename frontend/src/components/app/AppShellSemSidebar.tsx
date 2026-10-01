"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";

export function AppShellSemSidebar({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}