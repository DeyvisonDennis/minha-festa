"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { apiFetch, ApiError } from "@/lib/api";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setEnviado(true);
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
        Esqueci minha senha
      </h1>
      <p className="mt-1 text-sm text-muted">
        Informe seu e-mail e enviaremos um link para redefinir sua senha
      </p>

      {enviado ? (
        <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          Se o e-mail informado estiver cadastrado, você receberá um link de
          redefinição em instantes. Verifique também sua caixa de spam.
        </div>
      ) : (
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

          {erro && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}