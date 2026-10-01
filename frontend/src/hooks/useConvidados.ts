"use client";

import { useCallback, useEffect, useState } from "react";
import { type Convidado } from "@/lib/mock-convidados";
import { useAuth } from "@/context/AuthContext";

// Mesma estratégia temporária de localStorage do Cronograma — será
// substituído por uma tabela `convidados` real e uma API quando
// implementarmos a Gestão de Eventos de verdade. A chave inclui o ID do
// usuário para isolar dados entre contas.
function chaveStorage(usuarioId: string): string {
  return `minha-festa:convidados:${usuarioId}`;
}

export function useConvidados() {
  const { usuario } = useAuth();
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;

    function carregarInicial() {
      try {
        const salvo = window.localStorage.getItem(chaveStorage(usuario!.id));
        if (salvo && !cancelado) {
          setConvidados(JSON.parse(salvo) as Convidado[]);
        }
      } catch {
        // Mantém o mock se o dado estiver corrompido ou indisponível.
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
      window.localStorage.setItem(chaveStorage(usuario.id), JSON.stringify(convidados));
    } catch {
      // Ignora falha de armazenamento.
    }
  }, [convidados, carregado, usuario]);

  const adicionarConvidado = useCallback(
    (dados: Omit<Convidado, "id" | "emailEnviadoEm" | "statusRsvp">) => {
      const novo: Convidado = {
        ...dados,
        id: crypto.randomUUID(),
        emailEnviadoEm: null,
        statusRsvp: "PENDENTE",
      };
      setConvidados((atuais) => [novo, ...atuais]);
    },
    [],
  );

  const marcarEmailsComoEnviados = useCallback((ids: string[]) => {
    const hoje = new Date();
    const dataFormatada = `${String(hoje.getDate()).padStart(2, "0")} ${
      ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][
        hoje.getMonth()
      ]
    }`;
    setConvidados((atuais) =>
      atuais.map((c) => (ids.includes(c.id) ? { ...c, emailEnviadoEm: dataFormatada } : c)),
    );
  }, []);

  return { convidados, carregado, adicionarConvidado, marcarEmailsComoEnviados };
}