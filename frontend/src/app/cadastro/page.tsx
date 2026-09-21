"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TermsModal } from "@/components/auth/TermsModal";
import { TERMOS_DE_USO, POLITICA_DE_PRIVACIDADE } from "@/lib/legal-content";
import { apiFetch, ApiError, googleAuthUrl } from "@/lib/api";
import { PasswordInput } from "@/components/ui/PasswordInput";

type ModalAberto = "termos" | "privacidade" | null;

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState<ModalAberto>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ nome, email, senha }),
      });

      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setErro(err.message);
      } else {
        setErro("Não foi possível conectar ao servidor. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-serif text-2xl font-bold text-foreground">
        Criar conta
      </h1>
      <p className="mt-1 text-sm text-muted">
        Comece a organizar eventos gratuitamente
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="nome" className="text-sm font-medium text-foreground">
            Nome completo
          </label>
          <input
            id="nome"
            type="text"
            required
            minLength={3}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="senha" className="text-sm font-medium text-foreground">
            Senha
          </label>
          <PasswordInput
            id="senha"
            value={senha}
            onChange={setSenha}
            placeholder="Digite sua senha"
            required
            minLength={8}
          />
          <p className="mt-1 text-xs text-muted">Pelo menos 8 caracteres</p>
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-sm text-muted">
          <input
            type="checkbox"
            required
            checked={aceitouTermos}
            onChange={(e) => setAceitouTermos(e.target.checked)}
            className="mt-0.5 cursor-pointer"
          />
          <span>
            Li e concordo com os{" "}
            <button
              type="button"
              onClick={() => setModalAberto("termos")}
              className="cursor-pointer font-medium text-foreground underline hover:no-underline"
            >
              Termos de Uso
            </button>{" "}
            e a{" "}
            <button
              type="button"
              onClick={() => setModalAberto("privacidade")}
              className="cursor-pointer font-medium text-foreground underline hover:no-underline"
            >
              Política de Privacidade
            </button>
          </span>
        </label>

        {erro && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando || !aceitouTermos}
          className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {carregando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">ou continue com</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <a
        href={googleAuthUrl()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-black/5"
      >
        <GoogleIcon />
        Google
      </a>

      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Entrar
        </Link>
      </p>

      {modalAberto === "termos" && (
        <TermsModal
          titulo={TERMOS_DE_USO.titulo}
          atualizadoEm={TERMOS_DE_USO.atualizadoEm}
          conteudo={TERMOS_DE_USO.conteudo}
          onClose={() => setModalAberto(null)}
        />
      )}
      {modalAberto === "privacidade" && (
        <TermsModal
          titulo={POLITICA_DE_PRIVACIDADE.titulo}
          atualizadoEm={POLITICA_DE_PRIVACIDADE.atualizadoEm}
          conteudo={POLITICA_DE_PRIVACIDADE.conteudo}
          onClose={() => setModalAberto(null)}
        />
      )}
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.96 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.04l3-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}