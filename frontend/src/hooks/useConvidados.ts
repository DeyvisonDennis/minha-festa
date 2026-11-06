"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useEventoAtivo } from "@/context/EventoContext";
import { apiFetch } from "@/lib/api";
import {
  formatarDataEnvio,
  type Convidado,
  type NovoConvidado,
  type StatusRsvp,
} from "@/lib/convidados";

// Formato que a API devolve (a data de envio vem em ISO).
type ConvidadoApi = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  grupo: string;
  conviteEnviadoEm: string | null;
  statusRsvp: StatusRsvp;
  linkRsvp: string;
};

type RespostaEnvio = {
  enviados: number;
  falhas: number;
  semEmail: number;
  convidados: ConvidadoApi[];
};

export type ResultadoEnvio = {
  enviados: number;
  falhas: number;
  semEmail: number;
};

function paraConvidado(c: ConvidadoApi): Convidado {
  return {
    id: c.id,
    nome: c.nome,
    email: c.email,
    telefone: c.telefone,
    grupo: c.grupo,
    emailEnviadoEm: c.conviteEnviadoEm ? formatarDataEnvio(c.conviteEnviadoEm) : null,
    statusRsvp: c.statusRsvp,
    linkRsvp: c.linkRsvp,
  };
}

// O estado guarda de qual evento são os convidados, para que os de um evento
// nunca apareçam em outro (ao trocar de conta, por exemplo).
type EstadoConvidados = {
  eventoId: string;
  convidados: Convidado[];
  erro: boolean;
};

export function useConvidados() {
  const { evento } = useEventoAtivo();
  const eventoId = evento?.id;

  const [estado, setEstado] = useState<EstadoConvidados | null>(null);

  useEffect(() => {
    if (!eventoId) return;
    const id = eventoId;
    let cancelado = false;

    async function carregarInicial() {
      try {
        const data = await apiFetch<{ convidados: ConvidadoApi[] }>(`/eventos/${id}/convidados`);
        if (!cancelado) {
          setEstado({ eventoId: id, convidados: data.convidados.map(paraConvidado), erro: false });
        }
      } catch {
        if (!cancelado) setEstado({ eventoId: id, convidados: [], erro: true });
      }
    }

    carregarInicial();
    return () => {
      cancelado = true;
    };
  }, [eventoId]);

  const estadoDoEvento = estado && estado.eventoId === eventoId ? estado : null;
  const convidados = useMemo(() => estadoDoEvento?.convidados ?? [], [estadoDoEvento]);
  const erro = estadoDoEvento?.erro ?? false;
  const carregando = !!eventoId && estadoDoEvento === null;

  const atualizarConvidados = useCallback(
    (fn: (atuais: Convidado[]) => Convidado[]) => {
      if (!eventoId) return;
      setEstado((atual) =>
        atual && atual.eventoId === eventoId ? { ...atual, convidados: fn(atual.convidados) } : atual,
      );
    },
    [eventoId],
  );

  const recarregar = useCallback(async () => {
    if (!eventoId) return;
    try {
      const data = await apiFetch<{ convidados: ConvidadoApi[] }>(`/eventos/${eventoId}/convidados`);
      setEstado({ eventoId, convidados: data.convidados.map(paraConvidado), erro: false });
    } catch {
      setEstado({ eventoId, convidados: [], erro: true });
    }
  }, [eventoId]);

  // Espera o servidor confirmar. Quem chama (o modal) mostra o erro, se houver,
  // como "já existe um convidado com este e-mail".
  const adicionarConvidado = useCallback(
    async (dados: NovoConvidado) => {
      if (!eventoId) return;
      const data = await apiFetch<{ convidado: ConvidadoApi }>(`/eventos/${eventoId}/convidados`, {
        method: "POST",
        body: JSON.stringify({
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
          grupo: dados.grupo,
        }),
      });
      atualizarConvidados((atuais) => [paraConvidado(data.convidado), ...atuais]);
    },
    [eventoId, atualizarConvidados],
  );

  const enviarConvites = useCallback(
    async (dados: {
      convidadoIds: string[];
      assunto: string;
      mensagem: string;
    }): Promise<ResultadoEnvio> => {
      if (!eventoId) throw new Error("Nenhum evento ativo.");

      const resposta = await apiFetch<RespostaEnvio>(
        `/eventos/${eventoId}/convidados/enviar-convites`,
        {
          method: "POST",
          body: JSON.stringify({
            convidadoIds: dados.convidadoIds,
            assunto: dados.assunto,
            mensagem: dados.mensagem,
          }),
        },
      );

      // Só quem realmente recebeu o envio volta atualizado (com a data do convite).
      const atualizados = new Map(
        resposta.convidados.map((c): [string, Convidado] => [c.id, paraConvidado(c)]),
      );
      atualizarConvidados((atuais) => atuais.map((c) => atualizados.get(c.id) ?? c));

      return {
        enviados: resposta.enviados,
        falhas: resposta.falhas,
        semEmail: resposta.semEmail,
      };
    },
    [eventoId, atualizarConvidados],
  );

  return {
    convidados,
    carregando,
    erro,
    recarregar,
    adicionarConvidado,
    enviarConvites,
  };
}