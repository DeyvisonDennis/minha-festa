"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEventoAtivo } from "@/context/EventoContext";
import { TelaCarregando } from "@/components/ui/TelaCarregando";
import { TelaErroConexao } from "@/components/ui/TelaErroConexao";

export function RequireEvento({ children }: { children: React.ReactNode }) {
  const { evento, carregado, erro, recarregar } = useEventoAtivo();
  const router = useRouter();

  useEffect(() => {
    if (carregado && !erro && !evento) {
      router.replace("/onboarding");
    }
  }, [carregado, erro, evento, router]);

  if (carregado && erro) {
    return (
      <TelaErroConexao
        mensagem="Não foi possível carregar os dados do seu evento."
        onTentarNovamente={recarregar}
      />
    );
  }

  if (!carregado || !evento) {
    return <TelaCarregando />;
  }

  return <>{children}</>;
}