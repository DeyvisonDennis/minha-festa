"use client";

import { useState } from "react";
import { CalendarHeart, UserRound } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { EventoForm } from "@/components/configuracoes/EventoForm";
import { PerfilForm } from "@/components/configuracoes/PerfilForm";
import { useEventoAtivo } from "@/context/EventoContext";

type Aba = "perfil" | "evento";

// Notificações, Plano & Cobrança e Equipe entram aqui quando forem implementados.
const ABAS: { id: Aba; label: string; icon: typeof UserRound }[] = [
  { id: "perfil", label: "Perfil", icon: UserRound },
  { id: "evento", label: "Evento", icon: CalendarHeart },
];

function ConfiguracoesContent() {
  const [aba, setAba] = useState<Aba>("perfil");
  const { evento } = useEventoAtivo();

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-2xl font-bold text-foreground">Configurações</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Seções das configurações">
          {ABAS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAba(id)}
              aria-current={aba === id ? "page" : undefined}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                aba === id ? "bg-primary text-white" : "text-muted hover:bg-black/5 hover:text-foreground"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {aba === "perfil" && <PerfilForm />}
          {aba === "evento" && evento && <EventoForm evento={evento} />}
        </div>
      </div>
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <AppShell>
      <ConfiguracoesContent />
    </AppShell>
  );
}