"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TIPO_EVENTO_CONFIG, type TipoEvento } from "@/lib/tipos-evento";
import { MoneyInput } from "@/components/ui/MoneyInput";

export type DetalhesEvento = {
  nome: string;
  dataISO: string;
  numConvidados?: number;
  local?: string;
  cidade?: string;
  orcamento?: number;
};

type PassoDetalhesProps = {
  tipo: TipoEvento;
  onVoltar: () => void;
  onContinuar: (dados: DetalhesEvento) => void;
};

export function PassoDetalhes({ tipo, onVoltar, onContinuar }: PassoDetalhesProps) {
  const [nome, setNome] = useState("");
  const [dataISO, setDataISO] = useState("");
  const [numConvidados, setNumConvidados] = useState("");
  const [local, setLocal] = useState("");
  const [cidade, setCidade] = useState("");
  const [orcamento, setOrcamento] = useState<number | undefined>(undefined);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !dataISO) return;

    onContinuar({
      nome,
      dataISO,
      numConvidados: numConvidados ? Number(numConvidados) : undefined,
      local: local || undefined,
      cidade: cidade || undefined,
      orcamento,
    });
  }

  return (
    <div>
      <button
        onClick={onVoltar}
        className="flex cursor-pointer items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Voltar
      </button>

      <div className="mt-6 text-center">
        <span className="text-5xl">{TIPO_EVENTO_CONFIG[tipo].emoji}</span>
        <h1 className="mt-4 font-serif text-2xl font-bold text-foreground">
          Detalhes do evento
        </h1>
        <p className="mt-1 text-sm text-muted">
          Preencha as informações básicas. Você pode editar tudo depois.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-border bg-white p-6"
      >
        <div>
          <label className="text-sm font-medium text-foreground">
            Nome do evento <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do evento"
            className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">
              Data do evento <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={dataISO}
              onChange={(e) => setDataISO(e.target.value)}
              className="mt-1 w-full cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Número de convidados
            </label>
            <input
              type="number"
              min={0}
              value={numConvidados}
              onChange={(e) => setNumConvidados(e.target.value)}
              placeholder="150"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Local / Venue</label>
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Ex: Espaço Villa d'Este"
            className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Cidade</label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="São Paulo, SP"
            className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Orçamento estimado
          </label>
          <MoneyInput value={orcamento} onChange={setOrcamento} />
          <p className="mt-1 text-xs text-muted">
            Pode ser definido depois. Usaremos para acompanhar seus gastos.
          </p>
        </div>

        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Revisar e confirmar
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}