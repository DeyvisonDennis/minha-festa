"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Prioridade, Tarefa } from "@/lib/mock-cronograma";

const CATEGORIAS_SUGERIDAS = [
  "Fornecedor", "Catering", "Moda", "Convites", "Financeiro",
  "Música", "Decoração", "Logística", "Digital",
];

function hojeISO(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
    hoje.getDate(),
  ).padStart(2, "0")}`;
}

type NovaTarefaModalProps = {
  dataInicial?: string;
  onClose: () => void;
  onAdicionar: (tarefa: Omit<Tarefa, "id">) => void;
};

export function NovaTarefaModal({
  dataInicial,
  onClose,
  onAdicionar,
}: NovaTarefaModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_SUGERIDAS[0]);
  const [prioridade, setPrioridade] = useState<Prioridade>("MEDIA");
  const [data, setData] = useState(dataInicial ?? hojeISO());

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !data) return;

    onAdicionar({
      titulo,
      descricao,
      categoria,
      prazoISO: data,
      status: "PENDENTE",
      prioridade,
      responsavel: "",
    });

    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Nova tarefa</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="cursor-pointer rounded-full p-1.5 text-muted hover:bg-black/5 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Título</label>
            <input
              type="text"
              required
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Nome da tarefa"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Opcional"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Data</label>
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1 w-full cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="mt-1 w-full cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                {CATEGORIAS_SUGERIDAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Prioridade</label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as Prioridade)}
                className="mt-1 w-full cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Média</option>
                <option value="BAIXA">Baixa</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-black/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}