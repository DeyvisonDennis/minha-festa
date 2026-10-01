"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { TIPO_EVENTO_CONFIG, ORDEM_TIPOS, type TipoEvento } from "@/lib/tipos-evento";

type PassoTipoEventoProps = {
  onContinuar: (tipo: TipoEvento) => void;
};

export function PassoTipoEvento({ onContinuar }: PassoTipoEventoProps) {
  const [selecionado, setSelecionado] = useState<TipoEvento | null>(null);

  return (
    <div className="text-center">
      <span className="text-5xl">👋</span>
      <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">
        Bem-vinda ao Minha Festa!
      </h1>
      <p className="mt-2 text-muted">
        Vamos criar seu primeiro evento. Qual é o tipo de festa?
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ORDEM_TIPOS.map((tipo) => {
          const info = TIPO_EVENTO_CONFIG[tipo];
          const ativo = selecionado === tipo;
          return (
            <button
              key={tipo}
              onClick={() => setSelecionado(tipo)}
              className={`cursor-pointer rounded-2xl border-2 bg-white p-5 text-left transition ${
                ativo ? "border-primary" : "border-border hover:border-primary/40"
              }`}
            >
              <span className="text-3xl">{info.emoji}</span>
              <p className="mt-3 text-sm font-semibold text-foreground">{info.label}</p>
              <p className="text-xs text-muted">{info.descricao}</p>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => selecionado && onContinuar(selecionado)}
        disabled={!selecionado}
        className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continuar
        <ArrowRight size={16} />
      </button>
    </div>
  );
}