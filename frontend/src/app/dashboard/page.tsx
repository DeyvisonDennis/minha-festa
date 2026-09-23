"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CalendarClock, Users } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  EVENTO_MOCK,
  STATS_MOCK,
  TAREFAS_MOCK,
  RSVPS_MOCK,
  RSVP_RESUMO_MOCK,
} from "@/lib/mock-dashboard";

const STATUS_STYLE: Record<string, string> = {
  Confirmado: "text-green-700",
  Aguardando: "text-amber-600",
  Recusado: "text-red-600",
};

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function dataDeHoje() {
  const hoje = new Date();
  const texto = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function DashboardContent() {
  const { usuario } = useAuth();
  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-sm text-muted">{dataDeHoje()}</p>
        <h1 className="mt-1 flex items-center gap-2 font-serif text-2xl font-bold text-foreground">
          {saudacao()}, {primeiroNome}
          <Sparkles size={20} className="text-amber-500" />
        </h1>
        <p className="mt-1 text-sm text-muted">
          {EVENTO_MOCK.nome} · {EVENTO_MOCK.diasRestantes} dias para o grande dia
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl px-8 py-8 text-white">
        <Image
          src="https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?fm=jpg&q=80&w=1600&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            {EVENTO_MOCK.tipo}
            </span>
        <h2 className="mt-3 font-serif text-2xl font-bold">{EVENTO_MOCK.nome}</h2>
        <p className="mt-1 text-sm text-white/80">
          {EVENTO_MOCK.dataFormatada} · {EVENTO_MOCK.local}
        </p>

        <div className="mt-6 flex gap-10">
          <div>
            <p className="font-serif text-2xl font-bold">{EVENTO_MOCK.convidados}</p>
            <p className="text-xs text-white/70">Convidados</p>
          </div>
          <div>
            <p className="font-serif text-2xl font-bold">
              R$ {(EVENTO_MOCK.orcamento / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-white/70">Orçamento</p>
          </div>
          <div>
            <p className="font-serif text-2xl font-bold">{EVENTO_MOCK.tarefas}</p>
            <p className="text-xs text-white/70">Tarefas</p>
          </div>
        </div>
        </div>
       </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_MOCK.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-white p-5"
          >
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-2 font-serif text-2xl font-bold text-foreground">
              {stat.valor}
            </p>
            <p className="text-xs text-muted">{stat.meta}</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full ${stat.cor}`}
                style={{ width: `${stat.progresso}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Próximas tarefas
            </h3>
            <Link
              href="/cronograma"
              className="flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground"
            >
              Ver cronograma <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-4 space-y-1">
            {TAREFAS_MOCK.map((tarefa) => (
              <div
                key={tarefa.titulo}
                className="flex items-center gap-4 rounded-lg px-2 py-2.5 hover:bg-black/5"
              >
                <div className="w-11 shrink-0 rounded-lg bg-[#FAF7F2] px-1.5 py-1 text-center">
                  <p className="text-sm font-bold leading-none text-foreground">
                    {tarefa.dia}
                  </p>
                  <p className="text-[10px] text-muted">{tarefa.mes}</p>
                </div>
                <p className="flex-1 text-sm text-foreground">{tarefa.titulo}</p>
                <span className="shrink-0 rounded-full bg-[#FAF7F2] px-2.5 py-1 text-xs text-muted">
                  {tarefa.categoria}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-foreground">
              RSVPs recentes
            </h3>
            <Link
              href="/convidados"
              className="flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-4 space-y-1">
            {RSVPS_MOCK.map((rsvp) => (
              <div
                key={rsvp.email}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-black/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-sm font-semibold text-foreground">
                  {rsvp.nome[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {rsvp.nome}
                  </p>
                  <p className="truncate text-xs text-muted">{rsvp.email}</p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold ${STATUS_STYLE[rsvp.status]}`}
                >
                  {rsvp.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-border pt-4 text-xs">
            <span className="text-green-700">Confirmados: <strong className="text-foreground">{RSVP_RESUMO_MOCK.confirmados}</strong></span>
            <span className="text-amber-600">Aguardando: <strong className="text-foreground">{RSVP_RESUMO_MOCK.aguardando}</strong></span>
            <span className="text-red-600">Recusados: <strong className="text-foreground">{RSVP_RESUMO_MOCK.recusados}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/cronograma"
          className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 hover:bg-black/5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF7F2] text-[#c98a3e]">
            <CalendarClock size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Ver cronograma</p>
            <p className="text-xs text-muted">Lista, Kanban e Calendário</p>
          </div>
        </Link>

        <Link
          href="/convidados"
          className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 hover:bg-black/5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF7F2] text-[#6b5ca5]">
            <Users size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Gerenciar convidados</p>
            <p className="text-xs text-muted">RSVP e envio de e-mails</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}