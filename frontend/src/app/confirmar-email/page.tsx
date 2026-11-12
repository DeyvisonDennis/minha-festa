"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { AlertaErro } from "@/components/ui/AlertaErro";
import { apiFetch } from "@/lib/api";
import { mensagemDeErro } from "@/lib/erros";

function ConfirmarEmailConteudo() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const { recarregar } = useAuth();

  const [confirmando, setConfirmando] = useState(false);
  const [emailNovo, setEmailNovo] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // A confirmação só acontece no clique, nunca ao abrir a página: alguns
  // provedores de e-mail visitam os links sozinhos para checar segurança.
  async function confirmar() {
    if (!token) return;
    setErro(null);
    setConfirmando(true);

    try {
      const data = await apiFetch<{ email: string }>("/conta/email/confirmar", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      // As sessões foram encerradas no servidor; aqui limpa os cookies deste
      // navegador e avisa o AuthContext que não há mais ninguém logado.
      try {
        await apiFetch("/auth/logout", { method: "POST" });
      } catch {
        // Sem sessão neste navegador, não há o que limpar.
      }
      await recarregar();
      setEmailNovo(data.email);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setConfirmando(false);
    }
  }

  if (!token) {
    return (
      <AlertaErro className="mt-6">
        Este link é inválido ou está incompleto. Peça a troca de e-mail de novo em
        Configurações, na aba Perfil.
      </AlertaErro>
    );
  }

  if (emailNovo) {
    return (
      <div className="mt-6 space-y-4">
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          Pronto! O e-mail da sua conta agora é <strong className="break-all">{emailNovo}</strong>.
          Por segurança, você foi desconectado de todos os dispositivos.
        </div>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Entrar com o novo e-mail
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-muted">
        Ao confirmar, este passa a ser o e-mail da sua conta, e você será desconectado de
        todos os dispositivos.
      </p>

      <AlertaErro>{erro}</AlertaErro>

      <button
        type="button"
        onClick={confirmar}
        disabled={confirmando}
        className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {confirmando ? "Confirmando..." : "Confirmar novo e-mail"}
      </button>
    </div>
  );
}

export default function ConfirmarEmailPage() {
  return (
    <AuthLayout>
      <h1 className="font-serif text-2xl font-bold text-foreground">Confirmar novo e-mail</h1>
      <p className="mt-1 text-sm text-muted">Último passo para trocar o e-mail da sua conta</p>

      <Suspense fallback={<p className="mt-6 text-sm text-muted">Carregando...</p>}>
        <ConfirmarEmailConteudo />
      </Suspense>
    </AuthLayout>
  );
}