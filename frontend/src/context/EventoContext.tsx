"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { TipoEvento } from "@/lib/tipos-evento";

export type EventoAtivo = {
  id: string;
  tipo: TipoEvento;
  nome: string;
  dataISO: string;
  local?: string;
  cidade?: string;
  orcamento: number;
  convidadosEstimados?: number;
  imagemCapaUrl: string;
};

export type NovoEvento = {
  tipo: TipoEvento;
  nome: string;
  dataISO: string;
  convidadosEstimados?: number;
  local?: string;
  cidade?: string;
  orcamento?: number;
  imagemCapaUrl: string;
};

// O estado guarda de qual usuário é o evento. Assim, ao trocar de conta no
// mesmo navegador, os dados da conta anterior nunca aparecem para a nova.
type EstadoEvento = {
  usuarioId: string;
  evento: EventoAtivo | null;
  erro: boolean;
};

type EventoContextType = {
  evento: EventoAtivo | null;
  carregado: boolean;
  erro: boolean;
  recarregar: () => Promise<void>;
  criarEvento: (dados: NovoEvento) => Promise<void>;
  alterarCapa: (imagemCapaUrl: string) => Promise<void>;
};

const EventoContext = createContext<EventoContextType | undefined>(undefined);

export function EventoProvider({ children }: { children: React.ReactNode }) {
  const { usuario, carregando: authCarregando } = useAuth();
  const usuarioId = usuario?.id;
  const [estado, setEstado] = useState<EstadoEvento | null>(null);

  useEffect(() => {
    if (!usuarioId) return;
    const id = usuarioId;
    let cancelado = false;

    async function carregarInicial() {
      try {
        const data = await apiFetch<{ evento: EventoAtivo | null }>("/eventos/ativo");
        if (!cancelado) setEstado({ usuarioId: id, evento: data.evento, erro: false });
      } catch {
        if (!cancelado) setEstado({ usuarioId: id, evento: null, erro: true });
      }
    }

    carregarInicial();
    return () => {
      cancelado = true;
    };
  }, [usuarioId]);

  const estadoDoUsuario = estado && estado.usuarioId === usuarioId ? estado : null;
  const evento = estadoDoUsuario?.evento ?? null;
  const erro = estadoDoUsuario?.erro ?? false;
  const eventoId = evento?.id;
  const carregado = !authCarregando && (!usuarioId || estadoDoUsuario !== null);

  const recarregar = useCallback(async () => {
    if (!usuarioId) return;
    try {
      const data = await apiFetch<{ evento: EventoAtivo | null }>("/eventos/ativo");
      setEstado({ usuarioId, evento: data.evento, erro: false });
    } catch {
      setEstado({ usuarioId, evento: null, erro: true });
    }
  }, [usuarioId]);

  const criarEvento = useCallback(
    async (dados: NovoEvento) => {
      if (!usuarioId) return;
      const data = await apiFetch<{ evento: EventoAtivo }>("/eventos", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      setEstado({ usuarioId, evento: data.evento, erro: false });
    },
    [usuarioId],
  );

  const alterarCapa = useCallback(
    async (imagemCapaUrl: string) => {
      if (!usuarioId || !eventoId) return;
      const data = await apiFetch<{ evento: EventoAtivo }>(`/eventos/${eventoId}/capa`, {
        method: "PATCH",
        body: JSON.stringify({ imagemCapaUrl }),
      });
      setEstado({ usuarioId, evento: data.evento, erro: false });
    },
    [usuarioId, eventoId],
  );

  const valor = useMemo(
    () => ({ evento, carregado, erro, recarregar, criarEvento, alterarCapa }),
    [evento, carregado, erro, recarregar, criarEvento, alterarCapa],
  );

  return <EventoContext.Provider value={valor}>{children}</EventoContext.Provider>;
}

export function useEventoAtivo() {
  const ctx = useContext(EventoContext);
  if (!ctx) {
    throw new Error("useEventoAtivo precisa ser usado dentro de <EventoProvider>");
  }
  return ctx;
}