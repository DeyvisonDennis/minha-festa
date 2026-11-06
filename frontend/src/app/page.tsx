"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TelaErroConexao } from "@/components/ui/TelaErroConexao";
import { TelaCarregando } from "@/components/ui/TelaCarregando";

export default function HomePage() {
  const { usuario, carregando, erroConexao, recarregar } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    if (usuario) router.replace("/dashboard");
    else if (!erroConexao) router.replace("/login");
  }, [carregando, usuario, erroConexao, router]);

  if (!carregando && !usuario && erroConexao) {
    return <TelaErroConexao onTentarNovamente={recarregar} />;
  }

  return <TelaCarregando />;
}