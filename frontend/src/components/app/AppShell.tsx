"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { useEventoAtivo } from "@/context/EventoContext";
import { RequireEvento } from "./RequireEvento";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { evento } = useEventoAtivo();

  return (
    <RequireAuth>
      <RequireEvento>
        <div className="flex h-screen flex-col overflow-hidden bg-[#FAF7F2] lg:flex-row">
          <Sidebar />
          {/* A key faz a página recomeçar do zero ao trocar de evento: filtros,
              seleções, modais e formulários do evento anterior são descartados. */}
          <main key={evento?.id} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </RequireEvento>
    </RequireAuth>
  );
}