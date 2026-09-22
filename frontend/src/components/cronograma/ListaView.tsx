"use client";

import { useMemo, useState } from "react";
import { Search, Calendar as CalendarIcon, Check } from "lucide-react";
import {
  TAREFAS_MOCK,
  STATUS_CONFIG,
  PRIORIDADE_COR,
  formatarDataCurta,
  type StatusTarefa,
  type Tarefa,
} from "@/lib/mock-cronograma";

type Filtro = "TODOS" | StatusTarefa;

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "TODOS", label: "Todos" },
  { id: "PENDENTE", label: "A fazer" },
  { id: "EM_ANDAMENTO", label: "Em andamento" },
  { id: "CONCLUIDA", label: "Concluído" },
];

export function ListaView() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(TAREFAS_MOCK);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("TODOS");

  function alternarConcluida(id: string) {
    setTarefas((atuais) =>
      atuais.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "CONCLUIDA" ? "PENDENTE" : "CONCLUIDA" }
          : t,
      ),
    );
  }

  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter((t) => {
      const bateFiltro = filtro === "TODOS" || t.status === filtro;
      const bateBusca = t.titulo.toLowerCase().includes(busca.toLowerCase());
      return bateFiltro && bateBusca;
    });
  }, [tarefas, busca, filtro]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar tarefa..."
            className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
          {FILTROS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFiltro(id)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition ${
                filtro === id
                  ? "bg-[#3d2b1f] text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
        {tarefasFiltradas.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-muted">
            Nenhuma tarefa encontrada.
          </p>
        )}

        {tarefasFiltradas.map((tarefa) => {
          const concluida = tarefa.status === "CONCLUIDA";
          const { dia, mes } = formatarDataCurta(tarefa.prazoISO);
          const statusInfo = STATUS_CONFIG[tarefa.status];

          return (
            <div
              key={tarefa.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-black/[0.02]"
            >
              <button
                onClick={() => alternarConcluida(tarefa.id)}
                aria-label={concluida ? "Marcar como não concluída" : "Marcar como concluída"}
                className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition ${
                  concluida
                    ? "border-green-600 bg-green-600"
                    : "border-border hover:border-primary"
                }`}
              >
                {concluida && <Check size={12} className="text-white" />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-semibold ${
                      concluida ? "text-muted line-through" : "text-foreground"
                    }`}
                  >
                    {tarefa.titulo}
                  </p>
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORIDADE_COR[tarefa.prioridade]}`}
                  />
                </div>
                <p className="truncate text-xs text-muted">{tarefa.descricao}</p>
              </div>

              <span className="hidden shrink-0 rounded-full bg-[#FAF7F2] px-2.5 py-1 text-xs text-muted sm:inline-block">
                {tarefa.categoria}
              </span>

              <span className="hidden shrink-0 items-center gap-1 text-xs text-muted sm:flex">
                <CalendarIcon size={13} />
                {dia} {mes}
              </span>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
              >
                {statusInfo.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}