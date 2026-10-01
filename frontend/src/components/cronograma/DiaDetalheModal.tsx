"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Calendar as CalendarIcon } from "lucide-react";
import {
  PRIORIDADE_COR,
  type Prioridade,
  type StatusTarefa,
  type Tarefa,
} from "@/lib/mock-cronograma";
import { StatusSelect } from "./StatusSelect";

const CATEGORIAS_SUGERIDAS = [
  "Fornecedor", "Catering", "Moda", "Convites", "Financeiro",
  "Música", "Decoração", "Logística", "Digital",
];

type DiaDetalheModalProps = {
  dataISO: string;
  dataFormatada: string;
  tarefas: Tarefa[];
  onClose: () => void;
  onAlterarStatus: (id: string, status: StatusTarefa) => void;
  onAdicionarTarefa: (tarefa: Omit<Tarefa, "id">) => void;
};

export function DiaDetalheModal({
  dataISO,
  dataFormatada,
  tarefas,
  onClose,
  onAlterarStatus,
  onAdicionarTarefa,
}: DiaDetalheModalProps) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_SUGERIDAS[0]);
  const [prioridade, setPrioridade] = useState<Prioridade>("MEDIA");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;

    onAdicionarTarefa({
      titulo,
      descricao,
      categoria,
      prazoISO: dataISO,
      status: "PENDENTE",
      prioridade,
      responsavel: "",
    });

    setTitulo("");
    setDescricao("");
    setMostrarForm(false);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} className="text-muted" />
            <h2 className="font-serif text-lg font-bold text-foreground">
              {dataFormatada}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="cursor-pointer rounded-full p-1.5 text-muted hover:bg-black/5 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tarefas.length === 0 && !mostrarForm && (
            <p className="py-6 text-center text-sm text-muted">
              Nenhuma tarefa cadastrada para este dia.
            </p>
          )}

          <div className="space-y-3">
            {tarefas.map((tarefa) => (
              <div key={tarefa.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {tarefa.titulo}
                      </p>
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORIDADE_COR[tarefa.prioridade]}`}
                      />
                    </div>
                    {tarefa.descricao && (
                      <p className="mt-0.5 text-xs text-muted">{tarefa.descricao}</p>
                    )}
                    <span className="mt-2 inline-block rounded-full bg-[#FAF7F2] px-2 py-0.5 text-xs text-muted">
                      {tarefa.categoria}
                    </span>
                  </div>
                  <StatusSelect
                    status={tarefa.status}
                    onChange={(status) => onAlterarStatus(tarefa.id, status)}
                  />
                </div>
              </div>
            ))}
          </div>

          {mostrarForm ? (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-xl border border-border p-4">
              <div>
                <label className="text-xs font-medium text-foreground">Título</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Nome da tarefa"
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Descrição</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Opcional"
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-foreground">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="mt-1 w-full cursor-pointer rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {CATEGORIAS_SUGERIDAS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value as Prioridade)}
                    className="mt-1 w-full cursor-pointer rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Média</option>
                    <option value="BAIXA">Baixa</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setMostrarForm(false)}
                  className="flex-1 cursor-pointer rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-black/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 cursor-pointer rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  Adicionar
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setMostrarForm(true)}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#FAF7F2] py-2.5 text-sm font-medium text-muted hover:text-foreground"
            >
              <Plus size={15} />
              Nova tarefa neste dia
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}