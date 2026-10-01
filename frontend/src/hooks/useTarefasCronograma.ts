"use client";

import { useCallback, useEffect, useState } from "react";
import { type StatusTarefa, type Tarefa } from "@/lib/mock-cronograma";
import { useAuth } from "@/context/AuthContext";

// Persistência temporária no navegador (localStorage), só para o estado
// sobreviver a um recarregamento de página enquanto não há backend real
// para o Cronograma. Será substituído por chamadas à API futuramente. A
// chave inclui o ID do usuário para isolar dados entre contas.
function chaveStorage(usuarioId: string): string {
  return `minha-festa:cronograma-tarefas:${usuarioId}`;
}

export function useTarefasCronograma() {
  const { usuario } = useAuth();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;

    function carregarInicial() {
      try {
        const salvo = window.localStorage.getItem(chaveStorage(usuario!.id));
        if (salvo && !cancelado) {
          setTarefas(JSON.parse(salvo) as Tarefa[]);
        }
      } catch {
        // Se der erro (dado corrompido, modo privado, etc.), mantém o mock.
      } finally {
        if (!cancelado) setCarregado(true);
      }
    }

    carregarInicial();

    return () => {
      cancelado = true;
    };
  }, [usuario]);

  useEffect(() => {
    if (!carregado || !usuario) return;
    try {
      window.localStorage.setItem(chaveStorage(usuario.id), JSON.stringify(tarefas));
    } catch {
      // Ignora falha de armazenamento (ex: modo privado do navegador).
    }
  }, [tarefas, carregado, usuario]);

  const alterarStatus = useCallback((id: string, status: StatusTarefa) => {
    setTarefas((atuais) => atuais.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const adicionarTarefa = useCallback((tarefa: Omit<Tarefa, "id">) => {
    setTarefas((atuais) => [{ ...tarefa, id: crypto.randomUUID() }, ...atuais]);
  }, []);

  const reordenarTarefas = useCallback((novaLista: Tarefa[]) => {
    setTarefas(novaLista);
  }, []);

  return { tarefas, alterarStatus, adicionarTarefa, reordenarTarefas };
}