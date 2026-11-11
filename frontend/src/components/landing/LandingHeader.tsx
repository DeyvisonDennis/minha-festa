"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LINKS_MENU } from "@/lib/landing-data";
import { Logo } from "./Logo";

export function LandingHeader() {
  const [aberto, setAberto] = useState(false);
  const { usuario } = useAuth();
  const fechar = () => setAberto(false);

  return (
    <header className="header">
      <div className="lp-container header-in">
        <Logo />
        <nav id="menu" className={`nav ${aberto ? "open" : ""}`} aria-label="Principal">
          {LINKS_MENU.map(([texto, id]) => (
            <Link key={id} href={`/#${id}`} onClick={fechar}>
              {texto}
            </Link>
          ))}
          {usuario ? (
            <Link href="/dashboard" className="btn btn-dark nav-cta" onClick={fechar}>
              Ir para o painel
            </Link>
          ) : (
            <>
              <Link href="/login" className="nav-login" onClick={fechar}>
                Entrar
              </Link>
              <Link href="/cadastro" className="btn btn-dark nav-cta" onClick={fechar}>
                Criar meu evento
              </Link>
            </>
          )}
        </nav>
        <button
          className="menu-btn"
          aria-expanded={aberto}
          aria-controls="menu"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto(!aberto)}
        >
          {aberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
