"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShellSemSidebar } from "@/components/app/AppShellSemSidebar";
import { useEventoAtivo } from "@/context/EventoContext";
import { urlCapaSugerida } from "@/lib/opcoes-capa";
import type { TipoEvento } from "@/lib/tipos-evento";
import { PassoTipoEvento } from "@/components/onboarding/PassoTipoEvento";
import { PassoDetalhes, type DetalhesEvento } from "@/components/onboarding/PassoDetalhes";
import { PassoConfirmar } from "@/components/onboarding/PassoConfirmar";
import { TelaErroConexao } from "@/components/ui/TelaErroConexao";
import { TelaCarregando } from "@/components/ui/TelaCarregando";
import { Marca } from "@/components/ui/Marca";
import { mensagemDeErro } from "@/lib/erros";

type Passo = 1 | 2 | 3;

const PASSOS: { id: Passo; label: string }[] = [
  { id: 1, label: "Tipo de evento" },
  { id: 2, label: "Detalhes" },
  { id: 3, label: "Confirmar" },
];

function OnboardingContent() {
  const router = useRouter();
  const { evento, carregado, erro: erroCarregamento, recarregar, criarEvento } = useEventoAtivo();
  // ?novo=1: quem já tem evento e quer criar mais um (seletor da Sidebar).
  const novoEvento = useSearchParams().get("novo") === "1";
  const [passo, setPasso] = useState<Passo>(1);
  const [tipo, setTipo] = useState<TipoEvento | null>(null);
  const [detalhes, setDetalhes] = useState<DetalhesEvento | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Quem já tem um evento não precisa do assistente, a não ser que esteja criando outro.
  useEffect(() => {
    if (carregado && evento && !novoEvento) {
      router.replace("/dashboard");
    }
  }, [carregado, evento, novoEvento, router]);

  function handleTipoEscolhido(tipoEscolhido: TipoEvento) {
    setTipo(tipoEscolhido);
    setPasso(2);
  }

  function handleDetalhesPreenchidos(dados: DetalhesEvento) {
    setDetalhes(dados);
    setPasso(3);
  }

  async function handleConfirmar() {
    if (!tipo || !detalhes) return;

    setErro(null);
    setSalvando(true);

    try {
      await criarEvento({
        tipo,
        nome: detalhes.nome,
        dataISO: detalhes.dataISO,
        convidadosEstimados: detalhes.numConvidados,
        local: detalhes.local,
        cidade: detalhes.cidade,
        orcamento: detalhes.orcamento,
        imagemCapaUrl: urlCapaSugerida(tipo),
      });
      router.push("/dashboard");
    } catch (err) {
      setErro(mensagemDeErro(err));
      setSalvando(false);
    }
  }

  if (carregado && erroCarregamento) {
    return <TelaErroConexao onTentarNovamente={recarregar} />;
  }

  if (!carregado || (evento && !novoEvento)) {
    return <TelaCarregando />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="border-b border-border bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Marca />

          <div className="flex items-center gap-2">
            {PASSOS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      p.id <= passo ? "bg-[#3d2b1f] text-white" : "bg-border text-muted"
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
        {novoEvento && evento && passo === 1 && (
          <Link href="/dashboard" className="mb-6 inline-block text-sm text-muted hover:text-foreground">
            ← Voltar ao painel
          </Link>
        )}
        {passo === 1 && (
          <PassoTipoEvento onContinuar={handleTipoEscolhido} novoEvento={novoEvento && !!evento} />
        )}
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
            salvando={salvando}
            erro={erro}
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
      <Suspense fallback={<TelaCarregando />}>
        <OnboardingContent />
      </Suspense>
    </AppShellSemSidebar>
  );
}