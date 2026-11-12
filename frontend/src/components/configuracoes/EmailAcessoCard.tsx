"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { mensagemDeErro } from "@/lib/erros";
import { AlertaErro } from "@/components/ui/AlertaErro";
import { AlertaSucesso } from "@/components/ui/AlertaSucesso";
import { PasswordInput } from "@/components/ui/PasswordInput";

const CLASSE_INPUT =
  "mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary";

type EmailAcessoCardProps = {
  email: string;
  emailPendente: string | null;
  temSenha: boolean;
  loginGoogle: boolean;
  onPendenteAlterado: (emailPendente: string | null) => void;
};

export function EmailAcessoCard({
  email,
  emailPendente,
  temSenha,
  loginGoogle,
  onPendenteAlterado,
}: EmailAcessoCardProps) {
  const [aberto, setAberto] = useState(false);
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function fecharFormulario() {
    setAberto(false);
    setNovoEmail("");
    setSenhaAtual("");
    setErro(null);
  }

  async function solicitar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setOk(null);
    setEnviando(true);

    try {
      const data = await apiFetch<{ message: string; emailPendente: string }>("/conta/email", {
        method: "POST",
        body: JSON.stringify({ novoEmail, senhaAtual }),
      });
      onPendenteAlterado(data.emailPendente);
      fecharFormulario();
      setOk(data.message);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEnviando(false);
    }
  }

  async function cancelarPedido() {
    setErro(null);
    setOk(null);
    setCancelando(true);

    try {
      await apiFetch("/conta/email/pendente", { method: "DELETE" });
      onPendenteAlterado(null);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setCancelando(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6">
      <h2 className="text-base font-semibold text-foreground">E-mail de acesso</h2>
      <p className="mt-1 text-xs text-muted">
        É o e-mail usado para entrar e para recuperar a senha.
      </p>

      <div className="mt-5">
        <label htmlFor="email-atual" className="text-sm font-medium text-foreground">
          E-mail atual
        </label>
        <input
          id="email-atual"
          type="email"
          value={email}
          disabled
          className={`${CLASSE_INPUT} cursor-not-allowed bg-[#FAF7F2] text-muted`}
        />
      </div>

      {emailPendente && (
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="min-w-0 flex-1">
            Aguardando a confirmação de <strong className="break-all">{emailPendente}</strong>.
            Enviamos um link para esse endereço, válido por 1 hora. O e-mail da conta só muda
            depois do clique.
          </p>
          <button
            type="button"
            onClick={cancelarPedido}
            disabled={cancelando}
            className="cursor-pointer text-xs font-semibold underline underline-offset-2 hover:text-amber-950 disabled:opacity-50"
          >
            {cancelando ? "Cancelando..." : "Cancelar pedido"}
          </button>
        </div>
      )}

      {aberto ? (
        <form onSubmit={solicitar} className="mt-5 space-y-4 rounded-xl border border-border p-4">
          <div>
            <label htmlFor="email-novo" className="text-sm font-medium text-foreground">
              Novo e-mail
            </label>
            <input
              id="email-novo"
              type="email"
              required
              autoFocus
              maxLength={150}
              value={novoEmail}
              onChange={(e) => setNovoEmail(e.target.value)}
              placeholder="seu.novo@email.com"
              className={CLASSE_INPUT}
            />
          </div>
          <div>
            <label htmlFor="email-senha" className="text-sm font-medium text-foreground">
              Senha atual
            </label>
            <PasswordInput id="email-senha" value={senhaAtual} onChange={setSenhaAtual} required />
          </div>

          <ul className="list-disc space-y-1 pl-5 text-xs text-muted">
            <li>Enviaremos um link de confirmação para o novo e-mail.</li>
            <li>Ao confirmar, você será desconectado de todos os dispositivos.</li>
            {loginGoogle && <li>Você continuará podendo entrar com o Google.</li>}
          </ul>

          <AlertaErro>{erro}</AlertaErro>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={fecharFormulario}
              disabled={enviando}
              className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-black/5 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enviando ? "Enviando..." : "Enviar link de confirmação"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <AlertaErro className="mt-5">{erro}</AlertaErro>
          <AlertaSucesso className="mt-5">{ok}</AlertaSucesso>

          <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
            {!temSenha && (
              <p className="mr-auto text-xs text-muted">
                Crie uma senha abaixo para poder trocar o e-mail.
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setOk(null);
                setAberto(true);
              }}
              disabled={!temSenha}
              className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Alterar e-mail
            </button>
          </div>
        </>
      )}
    </section>
  );
}