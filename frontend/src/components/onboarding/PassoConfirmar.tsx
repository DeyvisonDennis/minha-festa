"use client";

import { ArrowLeft, PartyPopper, FileText, Users, CalendarClock } from "lucide-react";
import { TIPO_EVENTO_CONFIG, type TipoEvento } from "@/lib/tipos-evento";
import type { DetalhesEvento } from "./PassoDetalhes";

type PassoConfirmarProps = {
  tipo: TipoEvento;
  detalhes: DetalhesEvento;
  onVoltar: () => void;
  onConfirmar: () => void;
};

function formatarDataExtensa(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function PassoConfirmar({
  tipo,
  detalhes,
  onVoltar,
  onConfirmar,
}: PassoConfirmarProps) {
  const info = TIPO_EVENTO_CONFIG[tipo];

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
        <span className="text-5xl">✨</span>
        <h1 className="mt-4 font-serif text-2xl font-bold text-foreground">
          Tudo certo!
        </h1>
        <p className="mt-1 text-sm text-muted">
          Confira os dados do seu evento antes de começar.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#3d2b1f] to-[#7c5a41] p-6 text-white">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
          {info.emoji} {info.label}
        </span>
        <h2 className="mt-3 font-serif text-2xl font-bold">{detalhes.nome}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
          <CalendarClock size={14} />
          {formatarDataExtensa(detalhes.dataISO)}
          {detalhes.local && ` · ${detalhes.local}`}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-white p-6">
        <p className="text-sm font-semibold text-foreground">O que acontece a seguir?</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">
              <FileText size={18} className="text-[#c98a3e]" />
            </span>
            <p className="text-sm text-foreground/80">
              Seu dashboard estará pronto com as primeiras tarefas sugeridas
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">
              <Users size={18} className="text-[#6b5ca5]" />
            </span>
            <p className="text-sm text-foreground/80">
              Você poderá adicionar convidados e enviar convites por e-mail
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">
              <CalendarClock size={18} className="text-[#5a8a5a]" />
            </span>
            <p className="text-sm text-foreground/80">
              O cronograma será criado com marcos importantes do seu evento
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onConfirmar}
        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        <PartyPopper size={16} />
        Criar meu evento e acessar o painel
      </button>
    </div>
  );
}