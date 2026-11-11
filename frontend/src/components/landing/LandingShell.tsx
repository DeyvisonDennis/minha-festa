import type { ReactNode } from "react";
import "./landing.css";
import { cormorant, lato } from "./fonts";
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";

// Moldura das páginas públicas (landing, termos, privacidade).
// A classe "landing" é o que isola o CSS e as fontes do resto do aplicativo.
export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div className={`landing ${cormorant.variable} ${lato.variable}`}>
      <a className="skip" href="#conteudo">
        Ir para o conteúdo
      </a>
      <LandingHeader />
      <main id="conteudo">{children}</main>
      <LandingFooter />
    </div>
  );
}
