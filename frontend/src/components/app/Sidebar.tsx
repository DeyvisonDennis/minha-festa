"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarClock, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/cronograma", label: "Cronograma", icon: CalendarClock },
  { href: "/convidados", label: "Convidados", icon: Users },
];

// Dados fictícios do evento ativo — serão substituídos por dados reais
// quando implementarmos a etapa de Gestão de Eventos.
const EVENTO_ATIVO_MOCK = {
  nome: "Casamento Ana & Pedro",
  dataFormatada: "15 Mar 2025",
  diasRestantes: 127,
};

export function Sidebar() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  const iniciais = usuario?.nome
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d2b1f] text-white">
          ★
        </span>
        <span className="font-serif text-lg font-bold text-foreground">
          Minha Festa
        </span>
      </div>

      <div className="mx-4 rounded-xl border border-border bg-[#FAF7F2] px-4 py-3">
        <p className="text-xs text-muted">Evento ativo</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
          {EVENTO_ATIVO_MOCK.nome}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {EVENTO_ATIVO_MOCK.dataFormatada} · {EVENTO_ATIVO_MOCK.diasRestantes} dias
        </p>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const ativo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                ativo
                  ? "bg-[#3d2b1f] text-white"
                  : "text-foreground/80 hover:bg-black/5"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {iniciais}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {usuario?.nome}
            </p>
            <p className="text-xs text-muted">Plano Gratuito</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 w-full cursor-pointer rounded-lg border border-border py-1.5 text-xs font-medium text-foreground hover:bg-black/5"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}