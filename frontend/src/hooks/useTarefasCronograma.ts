"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEventoAtivo } from "@/context/EventoContext";
import { apiFetch } from "@/lib/api";
import type { NovaTarefa, StatusTarefa, Tarefa } from "@/lib/cronograma";

// O estado guarda de qual evento são as tarefas, para que as de um evento
// nunca apareçam em outro (ao trocar de conta, por exemplo).
type EstadoTarefas = {
  eventoId: string;
  tarefas: Tarefa[];
  erro: boolean;
};

export function useTarefasCronograma() {
  const { evento } = useEventoAtivo();
  const eventoId = evento?.id;

  const [estado, setEstado] = useState<EstadoTarefas | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  // Fila das gravações: garante que cheguem ao servidor na mesma ordem em que
  // o usuário as fez, mesmo que ele arraste vários cards em sequência.
  const fila = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    if (!eventoId) return;
    const id = eventoId;
    let cancelado = false;

    async function carregarInicial() {
      try {
        const data = await apiFetch<{ tarefas: Tarefa[] }>(`/eventos/${id}/tarefas`);
        if (!cancelado) setEstado({ eventoId: id, tarefas: data.tarefas, erro: false });
      } catch {
        if (!cancelado) setEstado({ eventoId: id, tarefas: [], erro: true });
      }
    }

    carregarInicial();
    return () => {
      cancelado = true;
    };
  }, [eventoId]);

  const estadoDoEvento = estado && estado.eventoId === eventoId ? estado : null;
  const tarefas = useMemo(() => estadoDoEvento?.tarefas ?? [], [estadoDoEvento]);
  const erro = estadoDoEvento?.erro ?? false;
  const carregando = !!eventoId && estadoDoEvento === null;

  const atualizarTarefas = useCallback(
    (fn: (atuais: Tarefa[]) => Tarefa[]) => {
      if (!eventoId) return;
      setEstado((atual) =>
        atual && atual.eventoId === eventoId
          ? { ...atual, tarefas: fn(atual.tarefas) }
          : atual,
      );
    },
    [eventoId],
  );

  const recarregar = useCallback(async () => {
    if (!eventoId) return;
    try {
      const data = await apiFetch<{ tarefas: Tarefa[] }>(`/eventos/${eventoId}/tarefas`);
      setEstado({ eventoId, tarefas: data.tarefas, erro: false });
    } catch {
      setEstado({ eventoId, tarefas: [], erro: true });
    }
  }, [eventoId]);

  // Se uma gravação falhar, avisa o usuário e recarrega do servidor, que é a
  // fonte da verdade, para a tela não ficar diferente do que está salvo.
  const enfileirar = useCallback(
    (operacao: () => Promise<unknown>, mensagemErro: string) => {
      fila.current = fila.current.then(async () => {
        try {
          await operacao();
        } catch {
          setErroAcao(mensagemErro);
          await recarregar();
        }
      });
    },
    [recarregar],
  );

  const alterarStatus = useCallback(
    (id: string, status: StatusTarefa) => {
      atualizarTarefas((atuais) =>
        atuais.map((t) => (t.id === id ? { ...t, status } : t)),
      );
      enfileirar(
        () =>
          apiFetch(`/tarefas/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
          }),
        "Não foi possível atualizar a tarefa. Os dados foram recarregados.",
      );
    },
    [atualizarTarefas, enfileirar],
  );

  const reordenarTarefas = useCallback(
    (novaLista: Tarefa[]) => {
      if (!eventoId) return;
      atualizarTarefas(() => novaLista);
      enfileirar(
        () =>
          apiFetch(`/eventos/${eventoId}/tarefas/ordem`, {
            method: "PUT",
            body: JSON.stringify({
              itens: novaLista.map((t) => ({ id: t.id, status: t.status })),
            }),
          }),
        "Não foi possível salvar a nova ordem. Os dados foram recarregados.",
      );
    },
    [eventoId, atualizarTarefas, enfileirar],
  );

  // Aqui não há atualização instantânea: espera o servidor confirmar.
  // Quem chama (os modais) mostra o erro, se houver.
  const adicionarTarefa = useCallback(
    async (dados: NovaTarefa) => {
      if (!eventoId) return;
      const data = await apiFetch<{ tarefa: Tarefa }>(`/eventos/${eventoId}/tarefas`, {
        method: "POST",
        body: JSON.stringify({
          titulo: dados.titulo,
          descricao: dados.descricao,
          categoria: dados.categoria,
          prazoISO: dados.prazoISO,
          prioridade: dados.prioridade,
        }),
      });
      atualizarTarefas((atuais) => [data.tarefa, ...atuais]);
    },
    [eventoId, atualizarTarefas],
  );

  const limparErroAcao = useCallback(() => setErroAcao(null), []);

  return {
    tarefas,
    carregando,
    erro,
    erroAcao,
    limparErroAcao,
    recarregar,
    alterarStatus,
    adicionarTarefa,
    reordenarTarefas,
  };
}