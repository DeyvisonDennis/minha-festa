"use client";

import { useCallback, useEffect, useState } from "react";
import type { TipoEvento } from "@/lib/tipos-evento";
import { CAPA_SUGERIDA_POR_TIPO } from "@/lib/opcoes-capa";
import { useAuth } from "@/context/AuthContext";

// Persistência temporária no navegador — assim como o Cronograma, isto
// será substituído por uma tabela `eventos` real e uma API quando
// implementarmos a Gestão de Eventos de verdade. A chave inclui o ID do
// usuário para isolar os dados entre diferentes contas no mesmo navegador.
function chaveStorage(usuarioId: string): string {
  return `minha-festa:evento-ativo:${usuarioId}`;
}

export type EventoAtivo = {
  tipo: TipoEvento;
  nome: string;
  dataISO: string;
  numConvidados?: number;
  local?: string;
  cidade?: string;
  orcamento?: number;
  capaId: string;
};

export function useEventoAtivo() {
  const { usuario } = useAuth();
  const [evento, setEvento] = useState<EventoAtivo | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;

    function carregarInicial() {
      try {
        const salvo = window.localStorage.getItem(chaveStorage(usuario!.id));
        if (salvo && !cancelado) {
          setEvento(JSON.parse(salvo) as EventoAtivo);
        }
      } catch {
        // Mantém null se o dado estiver corrompido ou indisponível.
      } finally {
        if (!cancelado) setCarregado(true);
      }
    }

    carregarInicial();
    return () => {
      cancelado = true;
    };
  }, [usuario]);

    const criarEvento = useCallback(
    (dados: Omit<EventoAtivo, "capaId"> & { capaId?: string }) => {
      if (!usuario) return;
      const eventoCompleto: EventoAtivo = {
        ...dados,
        capaId: dados.capaId ?? CAPA_SUGERIDA_POR_TIPO[dados.tipo],
      };
      setEvento(eventoCompleto);
      try {
        window.localStorage.setItem(
          chaveStorage(usuario.id),
          JSON.stringify(eventoCompleto),
        );
      } catch {
        // Ignora falha de armazenamento (ex: modo privado do navegador).
      }
    },
    [usuario],
  );

  const alterarCapa = useCallback(
    (capaId: string) => {
      if (!usuario) return;
      setEvento((atual) => {
        if (!atual) return atual;
        const atualizado = { ...atual, capaId };
        try {
          window.localStorage.setItem(
            chaveStorage(usuario.id),
            JSON.stringify(atualizado),
          );
        } catch {
          // Ignora falha de armazenamento.
        }
        return atualizado;
      });
    },
    [usuario],
  );
  return { evento, carregado, criarEvento, alterarCapa };
}