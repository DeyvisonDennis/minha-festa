import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/LandingShell";
import { LegalPage } from "@/components/landing/LegalPage";
import { POLITICA_DE_PRIVACIDADE } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Política de privacidade • Minha Festa",
};

export default function PrivacidadePage() {
  return (
    <LandingShell>
      <LegalPage
        titulo={POLITICA_DE_PRIVACIDADE.titulo}
        atualizadoEm={POLITICA_DE_PRIVACIDADE.atualizadoEm}
        conteudo={POLITICA_DE_PRIVACIDADE.conteudo}
      />
    </LandingShell>
  );
}
