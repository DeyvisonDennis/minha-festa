"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { apiFetch, ApiError } from "@/lib/api";
import { PasswordInput } from "@/components/ui/PasswordInput";

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!token) {
      setErro("Link inválido. Solicite uma nova redefinição de senha.");
      return;
    }

    setCarregando(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, novaSenha }),
      });
      setSucesso(true);
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

  if (!token) {
    return (
      <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        Este link é inválido ou está incompleto. Solicite uma nova
        redefinição na tela de{" "}
        <Link href="/esqueci-senha" className="underline">
          esqueci minha senha
        </Link>
        .
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="mt-6 space-y-4">
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          Sua senha foi redefinida com sucesso.
        </div>
        <button
          onClick={() => router.push("/login")}
          className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Ir para o login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="novaSenha" className="text-sm font-medium text-foreground">
          Nova senha
        </label>
        <PasswordInput
          id="novaSenha"
          value={novaSenha}
          onChange={setNovaSenha}
          placeholder="Digite sua senha"
          required
          minLength={8}
        />
        <p className="mt-1 text-xs text-muted">Pelo menos 8 caracteres</p>
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
        {carregando ? "Redefinindo..." : "Redefinir senha"}
      </button>
    </form>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <AuthLayout>
      <h1 className="font-serif text-2xl font-bold text-foreground">
        Redefinir senha
      </h1>
      <p className="mt-1 text-sm text-muted">Cadastre uma nova senha</p>

      <Suspense fallback={<p className="mt-6 text-sm text-muted">Carregando...</p>}>
        <RedefinirSenhaForm />
      </Suspense>
    </AuthLayout>
  );
}