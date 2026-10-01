"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, CalendarClock, Users, Camera, Clock } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useEventoAtivo } from "@/hooks/useEventoAtivo";
import { useTarefasCronograma } from "@/hooks/useTarefasCronograma";
import { useConvidados } from "@/hooks/useConvidados";
import { TIPO_EVENTO_CONFIG } from "@/lib/tipos-evento";
import { obterUrlCapa } from "@/lib/opcoes-capa";
import { formatarMoeda } from "@/lib/moeda";
import { formatarDataCurta } from "@/lib/mock-cronograma";
import { RSVP_CONFIG } from "@/lib/mock-convidados";
import { CapaSelectorModal } from "@/components/dashboard/CapaSelectorModal";

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

function calcularDiasRestantes(dataISO: string): number {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const dataEvento = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diffMs = dataEvento.getTime() - hoje.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

function formatarDataExtensa(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function StatCard({
  label,
  valor,
  meta,
  progresso,
  cor,
}: {
  label: string;
  valor: string;
  meta: string;
  progresso: number | null;
  cor: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl font-bold text-foreground">{valor}</p>
      <p className="text-xs text-muted">{meta}</p>
      {progresso !== null ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div className={`h-full rounded-full ${cor}`} style={{ width: `${progresso}%` }} />
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-1 text-xs text-muted">
          {/* <Clock size={12} />
          Em breve */}
        </div>
      )}
    </div>
  );
}

function DashboardContent() {
  const { usuario } = useAuth();
  const { evento, alterarCapa } = useEventoAtivo();
  const { tarefas } = useTarefasCronograma();
  const { convidados } = useConvidados();
  const [modalCapaAberto, setModalCapaAberto] = useState(false);

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "";

  const resumoTarefas = useMemo(() => {
    const concluidas = tarefas.filter((t) => t.status === "CONCLUIDA").length;
    return { total: tarefas.length, concluidas };
  }, [tarefas]);

  const resumoConvidados = useMemo(() => {
    const confirmados = convidados.filter((c) => c.statusRsvp === "CONFIRMADO").length;
    const aguardando = convidados.filter((c) => c.statusRsvp === "PENDENTE").length;
    const recusados = convidados.filter((c) => c.statusRsvp === "NAO_CONFIRMADO").length;
    return { total: convidados.length, confirmados, aguardando, recusados };
  }, [convidados]);

  const proximasTarefas = useMemo(() => {
    return [...tarefas]
      .filter((t) => t.status !== "CONCLUIDA" && t.status !== "CANCELADA")
      .sort((a, b) => a.prazoISO.localeCompare(b.prazoISO))
      .slice(0, 5);
  }, [tarefas]);

  const rsvpsRecentes = convidados.slice(0, 4);

  if (!evento) return null;

  const diasRestantes = calcularDiasRestantes(evento.dataISO);
  const tipoInfo = TIPO_EVENTO_CONFIG[evento.tipo];

  const progressoConvidados =
    resumoConvidados.total > 0
      ? Math.round((resumoConvidados.confirmados / resumoConvidados.total) * 100)
      : 0;
  const progressoTarefas =
    resumoTarefas.total > 0
      ? Math.round((resumoTarefas.concluidas / resumoTarefas.total) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-sm text-muted">{dataDeHoje()}</p>
        <h1 className="mt-1 flex items-center gap-2 font-serif text-2xl font-bold text-foreground">
          {saudacao()}, {primeiroNome}
          <Sparkles size={20} className="text-amber-500" />
        </h1>
        <p className="mt-1 text-sm text-muted">
          {evento.nome} · {diasRestantes} dias para o grande dia
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl px-5 py-6 text-white sm:px-8 sm:py-8">
        <Image src={obterUrlCapa(evento.capaId)} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <button
          onClick={() => setModalCapaAberto(true)}
          className="absolute right-3 top-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/30 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/50 sm:right-4 sm:top-4"
        >
          <Camera size={14} />
          <span className="hidden sm:inline">Alterar capa</span>
        </button>
        <div className="relative">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            {tipoInfo.emoji} {tipoInfo.label}
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold">{evento.nome}</h2>
          <p className="mt-1 text-sm text-white/80">
            {formatarDataExtensa(evento.dataISO)}
            {evento.local && ` · ${evento.local}`}
          </p>

          <div className="mt-6 flex flex-wrap gap-6 sm:gap-10">
            <div>
              <p className="font-serif text-2xl font-bold">{resumoConvidados.total}</p>
              <p className="text-xs text-white/70">Convidados</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold">
                {evento.orcamento !== undefined ? formatarMoeda(evento.orcamento) : "—"}
              </p>
              <p className="text-xs text-white/70">Orçamento</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold">{resumoTarefas.total}</p>
              <p className="text-xs text-white/70">Tarefas</p>
            </div>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Convidados confirmados"
          valor={String(resumoConvidados.confirmados)}
          meta={`de ${resumoConvidados.total}`}
          progresso={progressoConvidados}
          cor="bg-[#8b6f47]"
        />
        <StatCard
          label="Orçamento utilizado"
          valor={formatarMoeda(0)}
          meta={
            evento.orcamento !== undefined
              ? `de ${formatarMoeda(evento.orcamento)}`
              : "Nenhum orçamento definido"
          }
          progresso={evento.orcamento !== undefined ? 0 : null}
          cor="bg-[#c98a3e]"
        />
        <StatCard
          label="Tarefas concluídas"
          valor={String(resumoTarefas.concluidas)}
          meta={`de ${resumoTarefas.total}`}
          progresso={progressoTarefas}
          cor="bg-[#5a8a5a]"
        />
        {/* TODO: reativar quando implementarmos a Gestão de Fornecedores
        <StatCard
          label="Fornecedores fechados"
          valor="0"
          meta="Sem fornecedores no momento"
          progresso={null}
          cor=""
        />
        */}
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
            {proximasTarefas.length === 0 && (
              <p className="py-6 text-center text-sm text-muted">
                Nenhuma tarefa pendente. 🎉
              </p>
            )}
            {proximasTarefas.map((tarefa) => {
              const { dia, mes } = formatarDataCurta(tarefa.prazoISO);
              return (
                <div
                  key={tarefa.id}
                  className="flex items-center gap-4 rounded-lg px-2 py-2.5 hover:bg-black/5"
                >
                  <div className="w-11 shrink-0 rounded-lg bg-[#FAF7F2] px-1.5 py-1 text-center">
                    <p className="text-sm font-bold leading-none text-foreground">{dia}</p>
                    <p className="text-[10px] text-muted">{mes}</p>
                  </div>
                  <p className="flex-1 truncate text-sm text-foreground">{tarefa.titulo}</p>
                  <span className="shrink-0 rounded-full bg-[#FAF7F2] px-2.5 py-1 text-xs text-muted">
                    {tarefa.categoria}
                  </span>
                </div>
              );
            })}
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
            {rsvpsRecentes.length === 0 && (
              <p className="py-6 text-center text-sm text-muted">
                Nenhum convidado cadastrado ainda.
              </p>
            )}
            {rsvpsRecentes.map((convidado) => {
              const rsvpInfo = RSVP_CONFIG[convidado.statusRsvp];
              return (
                <div
                  key={convidado.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-black/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-sm font-semibold text-foreground">
                    {convidado.nome[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {convidado.nome}
                    </p>
                    <p className="truncate text-xs text-muted">{convidado.email}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold ${rsvpInfo.text}`}>
                    {rsvpInfo.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex justify-between border-t border-border pt-4 text-xs text-muted">
            <span>
              Confirmados <strong className="text-foreground">{resumoConvidados.confirmados}</strong>
            </span>
            <span>
              Aguardando <strong className="text-foreground">{resumoConvidados.aguardando}</strong>
            </span>
            <span>
              Recusados <strong className="text-foreground">{resumoConvidados.recusados}</strong>
            </span>
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

      {modalCapaAberto && (
        <CapaSelectorModal
          capaAtualId={evento.capaId}
          onClose={() => setModalCapaAberto(false)}
          onSelecionar={alterarCapa}
        />
      )}
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