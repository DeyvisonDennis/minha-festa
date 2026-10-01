"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEventoAtivo } from "@/hooks/useEventoAtivo";

export function RequireEvento({ children }: { children: React.ReactNode }) {
  const { evento, carregado } = useEventoAtivo();
  const router = useRouter();

  useEffect(() => {
    if (carregado && !evento) {
      router.replace("/onboarding");
    }
  }, [carregado, evento, router]);

  if (!carregado || !evento) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <p className="text-sm text-muted">Carregando...</p>
      </div>
    );
  }

  return <>{children}</>;
}