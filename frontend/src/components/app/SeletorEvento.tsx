"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useEventoAtivo, type EventoAtivo } from "@/context/EventoContext";
import { calcularDiasRestantes, formatarDataResumida } from "@/lib/datas";
import { mensagemDeErro } from "@/lib/erros";
import { TIPO_EVENTO_CONFIG } from "@/lib/tipos-evento";
import { AlertaErro } from "@/components/ui/AlertaErro";

type SeletorEventoProps = {
  // Chamado ao escolher um evento ou ir criar um novo (fecha o menu no celular).
  onNavegar?: () => void;
};

export function SeletorEvento({ onNavegar }: SeletorEventoProps) {
  const { evento, listarEventos, selecionarEvento } = useEventoAtivo();

  const [aberto, setAberto] = useState(false);
  const [eventos, setEventos] = useState<EventoAtivo[] | null>(null);
  const [trocandoPara, setTrocandoPara] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const caixaRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!aberto) return;

    function cliqueFora(e: MouseEvent) {
      if (caixaRef.current && !caixaRef.current.contains(e.target as Node)) setAberto(false);
    }
    function tecla(e: KeyboardEvent) {
      if (e.key === "Escape") setAberto(false);
    }

    document.addEventListener("mousedown", cliqueFora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", cliqueFora);
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  if (!evento) return null;

  // A lista é buscada a cada abertura, para refletir eventos criados ou editados.
  async function abrir() {
    if (aberto) {
      setAberto(false);
      return;
    }
    setErro(null);
    setAberto(true);
    try {
      setEventos(await listarEventos());
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  async function escolher(id: string) {
    if (id === evento?.id) {
      setAberto(false);
      return;
    }
    setErro(null);
    setTrocandoPara(id);
    try {
      await selecionarEvento(id);
      setAberto(false);
      onNavegar?.();
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setTrocandoPara(null);
    }
  }

  return (
    <div ref={caixaRef} className="relative mx-4">
      <button
        type="button"
        onClick={abrir}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        title="Trocar de evento"
        className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-border bg-[#FAF7F2] px-4 py-3 text-left transition hover:border-primary/40"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">Evento ativo</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{evento.nome}</p>
          <p className="mt-0.5 text-xs text-muted">
            {formatarDataResumida(evento.dataISO)} · {calcularDiasRestantes(evento.dataISO)} dias
          </p>
        </div>
        <ChevronsUpDown size={16} className="shrink-0 text-muted" />
      </button>

      {aberto && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
          <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Seus eventos
          </p>

          {eventos === null && !erro && <p className="px-4 py-3 text-sm text-muted">Carregando...</p>}

          {eventos && (
            <ul role="listbox" aria-label="Seus eventos" className="max-h-72 overflow-y-auto py-1">
              {eventos.map((item) => {
                const ativo = item.id === evento.id;
                const info = TIPO_EVENTO_CONFIG[item.tipo] ?? TIPO_EVENTO_CONFIG.OUTRO;
                return (
                  <li key={item.id} role="option" aria-selected={ativo}>
                    <button
                      type="button"
                      onClick={() => escolher(item.id)}
                      disabled={trocandoPara !== null}
                      className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition hover:bg-black/5 disabled:cursor-wait ${
                        ativo ? "bg-[#FAF7F2]" : ""
                      }`}
                    >
                      <span className="text-lg" aria-hidden="true">
                        {info.emoji}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {item.nome}
                        </span>
                        <span className="block text-xs text-muted">
                          {trocandoPara === item.id
                            ? "Abrindo..."
                            : formatarDataResumida(item.dataISO)}
                        </span>
                      </span>
                      {ativo && <Check size={16} className="shrink-0 text-primary" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <AlertaErro className="mx-4 my-2">{erro}</AlertaErro>

          <Link
            href="/onboarding?novo=1"
            onClick={() => {
              setAberto(false);
              onNavegar?.();
            }}
            className="flex items-center gap-2 border-t border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-black/5"
          >
            <Plus size={16} />
            Criar novo evento
          </Link>
        </div>
      )}
    </div>
  );
}