"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TelaCarregando } from "@/components/ui/TelaCarregando";
import { TelaErroConexao } from "@/components/ui/TelaErroConexao";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { usuario, carregando, erroConexao, recarregar } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario && !erroConexao) {
      router.replace("/login");
    }
  }, [carregando, usuario, erroConexao, router]);

  if (!carregando && !usuario && erroConexao) {
    return <TelaErroConexao onTentarNovamente={recarregar} />;
  }

  if (carregando || !usuario) {
    return <TelaCarregando />;
  }

  return <>{children}</>;
}