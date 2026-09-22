"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) {
      router.replace("/login");
    }
  }, [carregando, usuario, router]);

  if (carregando || !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <p className="text-sm text-muted">Carregando...</p>
      </div>
    );
  }

  return <>{children}</>;
}