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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [contaGoogle, setContaGoogle] = useState(false);
  const [modalAberto, setModalAberto] = useState<ModalAberto>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setContaGoogle(false);
    setCarregando(true);

    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errorCode === "GOOGLE_ONLY_ACCOUNT") {
          setContaGoogle(true);
        } else {
          setErro(err.message);
        }
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
        Bem-vindo de volta
      </h1>
      <p className="mt-1 text-sm text-muted">Entre na sua conta para continuar</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          />
        </div>

        <div className="text-right">
          <Link href="/esqueci-senha" className="text-sm text-muted hover:text-foreground">
            Esqueci minha senha
          </Link>
        </div>

        {erro && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {erro}
          </p>
        )}

        {contaGoogle && (
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="mb-2">Esta conta usa login com Google.</p>
            <a
              href={googleAuthUrl()}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-medium hover:bg-amber-100"
            >
              Continuar com Google
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carregando ? "Entrando..." : "Entrar"}
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
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-foreground hover:underline">
          Criar conta
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-muted">
        Ao continuar, você concorda com os{" "}
        <button onClick={() => setModalAberto("termos")} className="cursor-pointer underline hover:text-foreground">
          Termos de Uso
        </button>{" "}
        e a{" "}
        <button onClick={() => setModalAberto("privacidade")} className="cursor-pointer underline hover:text-foreground">
          Política de Privacidade
        </button>
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