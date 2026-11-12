"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type CtaLinkProps = {
  className: string;
  children: ReactNode;
  rotuloLogado?: string;
};

// Visitante: leva ao cadastro. Quem já está logado: leva ao painel.
export function CtaLink({
  className,
  children,
  rotuloLogado = "Ir para o meu painel",
}: CtaLinkProps) {
  const { usuario } = useAuth();

  if (usuario) {
    return (
      <Link href="/dashboard" className={className}>
        {rotuloLogado}
      </Link>
    );
  }

  return (
    <Link href="/cadastro" className={className}>
      {children}
    </Link>
  );
}
