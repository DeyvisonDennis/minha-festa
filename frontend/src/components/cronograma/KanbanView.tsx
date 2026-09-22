"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import {
  TAREFAS_MOCK,
  STATUS_CONFIG,
  PRIORIDADE_COR,
  formatarDataCurta,
  type StatusTarefa,
  type Tarefa,
} from "@/lib/mock-cronograma";

const COLUNAS: StatusTarefa[] = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"];

function TarefaCard({ tarefa, arrastando }: { tarefa: Tarefa; arrastando?: boolean }) {
  const { dia, mes } = formatarDataCurta(tarefa.prazoISO);
  return (
    <div
      className={`rounded-xl border border-border bg-white p-3 ${
        arrastando ? "shadow-lg ring-2 ring-primary/30" : "hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#FAF7F2] px-2 py-0.5 text-xs text-muted">
          {tarefa.categoria}
        </span>
        <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORIDADE_COR[tarefa.prioridade]}`} />
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">{tarefa.titulo}</p>
      <p className="mt-0.5 text-xs text-muted">{tarefa.descricao}</p>
      <p className="mt-2 flex items-center gap-1 text-xs text-muted">
        <CalendarIcon size={12} />
        {dia} {mes}
      </p>
    </div>
  );
}

function TarefaDraggable({ tarefa }: { tarefa: Tarefa }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tarefa.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab touch-none active:cursor-grabbing ${isDragging ? "opacity-30" : ""}`}
    >
      <TarefaCard tarefa={tarefa} />
    </div>
  );
}

function Coluna({ status, tarefas }: { status: StatusTarefa; tarefas: Tarefa[] }) {
  const statusInfo = STATUS_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border p-4 transition-colors ${
        isOver ? "border-primary bg-primary/[0.03]" : "border-border bg-white"
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusInfo.dot}`} />
          <p className={`text-sm font-semibold ${statusInfo.text}`}>{statusInfo.label}</p>
        </div>
        <span className="rounded-full bg-[#FAF7F2] px-2 py-0.5 text-xs font-semibold text-muted">
          {tarefas.length}
        </span>
      </div>

      <div className="mt-3 min-h-[60px] space-y-3">
        {tarefas.map((tarefa) => (
          <TarefaDraggable key={tarefa.id} tarefa={tarefa} />
        ))}

        <button className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#FAF7F2] py-2 text-xs font-medium text-muted hover:text-foreground">
          <Plus size={14} />
          Adicionar tarefa
        </button>
      </div>
    </div>
  );
}

export function KanbanView() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(TAREFAS_MOCK);
  const [idArrastando, setIdArrastando] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setIdArrastando(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setIdArrastando(null);

    if (!over) return;

    const novoStatus = over.id as StatusTarefa;
    const tarefaId = String(active.id);

    setTarefas((atuais) =>
      atuais.map((t) =>
        t.id === tarefaId && t.status !== novoStatus ? { ...t, status: novoStatus } : t,
      ),
    );
  }

  const tarefaArrastando = tarefas.find((t) => t.id === idArrastando);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUNAS.map((status) => (
          <Coluna
            key={status}
            status={status}
            tarefas={tarefas.filter((t) => t.status === status)}
          />
        ))}
      </div>

      <DragOverlay>
        {tarefaArrastando ? <TarefaCard tarefa={tarefaArrastando} arrastando /> : null}
      </DragOverlay>
    </DndContext>
  );
}