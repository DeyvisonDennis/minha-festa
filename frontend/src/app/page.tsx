"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { usuario, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    router.replace(usuario ? "/dashboard" : "/login");
  }, [carregando, usuario, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
      <p className="text-sm text-muted">Carregando...</p>
    </div>
  );
}