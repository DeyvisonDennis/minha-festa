"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarClock, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEventoAtivo } from "@/hooks/useEventoAtivo";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/cronograma", label: "Cronograma", icon: CalendarClock },
  { href: "/convidados", label: "Convidados", icon: Users },
];

function calcularDiasRestantes(dataISO: string): number {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const dataEvento = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diffMs = dataEvento.getTime() - hoje.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatarDataCurta(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function Sidebar() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();
  const { evento } = useEventoAtivo();
  const [menuAberto, setMenuAberto] = useState(false);

  const iniciais = usuario?.nome
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

    const conteudoSidebar = (
    <>
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d2b1f] text-white">
            ★
          </span>
          <span className="font-serif text-lg font-bold text-foreground">
            Minha Festa
          </span>
        </div>
        <button
          onClick={() => setMenuAberto(false)}
          aria-label="Fechar menu"
          className="cursor-pointer rounded-lg p-1 text-muted hover:bg-black/5 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {evento && (
        <div className="mx-4 rounded-xl border border-border bg-[#FAF7F2] px-4 py-3">
          <p className="text-xs text-muted">Evento ativo</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {evento.nome}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {formatarDataCurta(evento.dataISO)} · {calcularDiasRestantes(evento.dataISO)} dias
          </p>
        </div>
      )}

      <nav className="mt-6 flex-1 space-y-1 px-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const ativo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuAberto(false)}
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
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3d2b1f] text-white text-sm">
            ★
          </span>
          <span className="font-serif text-base font-bold text-foreground">
            Minha Festa
          </span>
        </div>
        <button
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu"
          className="cursor-pointer rounded-lg p-1.5 text-foreground hover:bg-black/5"
        >
          <Menu size={22} />
        </button>
      </div>

      {menuAberto && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 -translate-x-full flex-col border-r border-border bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          menuAberto ? "translate-x-0" : ""
        }`}
      >
        {conteudoSidebar}
      </aside>
    </>
  );
}