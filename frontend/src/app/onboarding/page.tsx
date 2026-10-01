"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShellSemSidebar } from "@/components/app/AppShellSemSidebar";
import { useEventoAtivo } from "@/hooks/useEventoAtivo";
import type { TipoEvento } from "@/lib/tipos-evento";
import { PassoTipoEvento } from "@/components/onboarding/PassoTipoEvento";
import { PassoDetalhes, type DetalhesEvento } from "@/components/onboarding/PassoDetalhes";
import { PassoConfirmar } from "@/components/onboarding/PassoConfirmar";

type Passo = 1 | 2 | 3;

const PASSOS: { id: Passo; label: string }[] = [
  { id: 1, label: "Tipo de evento" },
  { id: 2, label: "Detalhes" },
  { id: 3, label: "Confirmar" },
];

function OnboardingContent() {
  const router = useRouter();
  const { criarEvento } = useEventoAtivo();

  const [passo, setPasso] = useState<Passo>(1);
  const [tipo, setTipo] = useState<TipoEvento | null>(null);
  const [detalhes, setDetalhes] = useState<DetalhesEvento | null>(null);

  function handleTipoEscolhido(tipoEscolhido: TipoEvento) {
    setTipo(tipoEscolhido);
    setPasso(2);
  }

  function handleDetalhesPreenchidos(dados: DetalhesEvento) {
    setDetalhes(dados);
    setPasso(3);
  }

  function handleConfirmar() {
    if (!tipo || !detalhes) return;

    criarEvento({
      tipo,
      nome: detalhes.nome,
      dataISO: detalhes.dataISO,
      numConvidados: detalhes.numConvidados,
      local: detalhes.local,
      cidade: detalhes.cidade,
      orcamento: detalhes.orcamento,
    });

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="border-b border-border bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d2b1f] text-white">
              ★
            </span>
            <span className="font-serif text-lg font-bold text-foreground">
              Minha Festa
            </span>
          </div>

          <div className="flex items-center gap-2">
            {PASSOS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      p.id < passo
                        ? "bg-[#3d2b1f] text-white"
                        : p.id === passo
                          ? "bg-[#3d2b1f] text-white"
                          : "bg-border text-muted"
                    }`}
                  >
                    {p.id < passo ? "✓" : p.id}
                  </span>
                  <span
                    className={`hidden text-sm sm:inline ${
                      p.id === passo ? "font-semibold text-foreground" : "text-muted"
                    }`}
                  >
                    {p.label}
                  </span>
                </div>
                {i < PASSOS.length - 1 && <span className="h-px w-6 bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </header>

     <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        {passo === 1 && <PassoTipoEvento onContinuar={handleTipoEscolhido} />}
        {passo === 2 && tipo && (
          <PassoDetalhes
            tipo={tipo}
            onVoltar={() => setPasso(1)}
            onContinuar={handleDetalhesPreenchidos}
          />
        )}
        {passo === 3 && tipo && detalhes && (
          <PassoConfirmar
            tipo={tipo}
            detalhes={detalhes}
            onVoltar={() => setPasso(2)}
            onConfirmar={handleConfirmar}
          />
        )}
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <AppShellSemSidebar>
      <OnboardingContent />
    </AppShellSemSidebar>
  );
}