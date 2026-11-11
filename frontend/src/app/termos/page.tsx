import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/LandingShell";
import { LegalPage } from "@/components/landing/LegalPage";
import { TERMOS_DE_USO } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Termos de uso • Minha Festa",
};

export default function TermosPage() {
  return (
    <LandingShell>
      <LegalPage
        titulo={TERMOS_DE_USO.titulo}
        atualizadoEm={TERMOS_DE_USO.atualizadoEm}
        conteudo={TERMOS_DE_USO.conteudo}
      />
    </LandingShell>
  );
}
