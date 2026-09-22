"use client";

import { useMemo, useState } from "react";
import { List, LayoutGrid, Calendar as CalendarIcon, Plus } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { TAREFAS_MOCK } from "@/lib/mock-cronograma";
import { ListaView } from "@/components/cronograma/ListaView";
import { KanbanView } from "@/components/cronograma/KanbanView";
import { CalendarioView } from "@/components/cronograma/CalendarioView";

type Visualizacao = "lista" | "kanban" | "calendario";

const ABAS: { id: Visualizacao; label: string; icon: typeof List }[] = [
  { id: "lista", label: "Lista", icon: List },
  { id: "kanban", label: "Kanban", icon: LayoutGrid },
  { id: "calendario", label: "Calendário", icon: CalendarIcon },
];

function CronogramaContent() {
  const [aba, setAba] = useState<Visualizacao>("lista");

  const resumo = useMemo(() => {
    const aFazer = TAREFAS_MOCK.filter((t) => t.status === "PENDENTE").length;
    const emAndamento = TAREFAS_MOCK.filter((t) => t.status === "EM_ANDAMENTO").length;
    const concluidas = TAREFAS_MOCK.filter((t) => t.status === "CONCLUIDA").length;
    const total = TAREFAS_MOCK.length;
    const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    return { aFazer, emAndamento, concluidas, total, progresso };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Cronograma
          </h1>
          <p className="mt-1 text-sm text-muted">
            {resumo.concluidas}/{resumo.total} tarefas concluídas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border bg-white p-1">
            {ABAS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setAba(id)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  aba === id
                    ? "bg-[#3d2b1f] text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <button className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
            <Plus size={16} />
            Nova tarefa
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Progresso geral</p>
          <span className="font-serif text-lg font-bold text-foreground">
            {resumo.progresso}%
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${resumo.progresso}%` }}
          />
        </div>
        <div className="mt-4 flex gap-8">
          <div>
            <p className="text-lg font-bold text-foreground">{resumo.aFazer}</p>
            <p className="text-xs text-muted">A fazer</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600">{resumo.emAndamento}</p>
            <p className="text-xs text-muted">Em andamento</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">{resumo.concluidas}</p>
            <p className="text-xs text-muted">Concluído</p>
          </div>
        </div>
      </div>

      {aba === "lista" && <ListaView />}
      {aba === "kanban" && <KanbanView />}
      {aba === "calendario" && <CalendarioView />}
    </div>
  );
}

export default function CronogramaPage() {
  return (
    <AppShell>
      <CronogramaContent />
    </AppShell>
  );
}