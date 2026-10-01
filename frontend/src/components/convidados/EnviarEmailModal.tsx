"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Send } from "lucide-react";
import type { Convidado } from "@/lib/mock-convidados";
import { apiFetch, ApiError } from "@/lib/api";
import { LINK_RSVP_MOCK } from "@/lib/mock-convidados";

type EnviarEmailModalProps = {
  convidados: Convidado[];
  onClose: () => void;
  onEnviar: (ids: string[]) => void;
};

const MENSAGEM_PADRAO = `Olá {nome},

É com muita alegria que convidamos você para celebrar conosco o nosso casamento!

📅 Data: 15 de Março de 2025
📍 Local: Espaço Villa d'Este — São Paulo, SP
🕖 Horário: 19h

Por favor, confirme sua presença clicando no link abaixo:
{link_rsvp}`;

export function EnviarEmailModal({
  convidados,
  onClose,
  onEnviar,
}: EnviarEmailModalProps) {
  const [aba, setAba] = useState<"compor" | "enviados">("compor");
  const [assunto, setAssunto] = useState("Você está convidado! 💌 Casamento Ana & Pedro");
  const [mensagem, setMensagem] = useState(MENSAGEM_PADRAO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const enviados = convidados.filter((c) => c.emailEnviadoEm !== null);
  const destinatariosVisiveis = convidados.slice(0, 5);
  const extras = convidados.length - destinatariosVisiveis.length;

  const primeiroConvidado = convidados[0];
  const mensagemPrevia = mensagem.replace(
    "{nome}",
    primeiroConvidado?.nome.split(" ")[0] ?? "",
  );

    async function handleEnviar() {
    setErro(null);
    setEnviando(true);

    try {
      const resultado = await apiFetch<{ enviados: number; falhas: number; total: number }>(
        "/convidados/enviar-convites",
        {
          method: "POST",
          body: JSON.stringify({
            destinatarios: convidados.map((c) => ({ nome: c.nome, email: c.email })),
            assunto,
            mensagem,
            linkRsvp: `https://${LINK_RSVP_MOCK}`,
          }),
        },
      );

      if (resultado.falhas > 0) {
        setErro(
          `${resultado.enviados} de ${resultado.total} e-mails enviados. ${resultado.falhas} falharam — verifique os endereços.`,
        );
      }

      onEnviar(convidados.map((c) => c.id));
    } catch (err) {
      if (err instanceof ApiError) {
        setErro(err.message);
      } else {
        setErro("Não foi possível conectar ao servidor. Tente novamente.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-serif text-xl font-bold text-foreground">Enviar e-mail</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="cursor-pointer rounded-full p-1.5 text-muted hover:bg-black/5 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-1 border-b border-border px-4 pt-3 sm:px-6">
          <button
            onClick={() => setAba("compor")}
            className={`cursor-pointer rounded-t-lg px-4 py-2 text-sm font-medium ${
              aba === "compor"
                ? "border border-b-white bg-white text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            ✏️ Compor
          </button>
          <button
            onClick={() => setAba("enviados")}
            className={`cursor-pointer rounded-t-lg px-4 py-2 text-sm font-medium ${
              aba === "enviados"
                ? "border border-b-white bg-white text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            ✅ Enviados
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {aba === "compor" ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Para ({convidados.length} destinatários)
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {destinatariosVisiveis.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
                    >
                      {c.nome}
                    </span>
                  ))}
                  {extras > 0 && (
                    <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                      +{extras} mais
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Assunto</label>
                <input
                  type="text"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Mensagem{" "}
                  <span className="font-normal text-muted">
                    — use {"{nome}"} e {"{link_rsvp}"} como variáveis
                  </span>
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  rows={8}
                  className="mt-1 w-full resize-none rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="rounded-lg border border-border bg-[#FAF7F2] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Prévia do e-mail
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">{assunto}</p>
                <p className="mt-2 whitespace-pre-line text-sm text-foreground/80">
                  {mensagemPrevia}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {enviados.length === 0 && (
                <p className="py-8 text-center text-sm text-muted">
                  Nenhum e-mail enviado ainda.
                </p>
              )}
              {enviados.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.nome}</p>
                    <p className="text-xs text-muted">{c.email}</p>
                  </div>
                  <span className="text-xs text-muted">{c.emailEnviadoEm}</span>
                </div>
              ))}
            </div>
          )}
        </div>

                {aba === "compor" && (
          <div className="border-t border-border px-6 py-4">
            {erro && (
              <p className="mb-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {erro}
              </p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{convidados.length} destinatários</p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={enviando}
                  className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEnviar}
                  disabled={enviando}
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={15} />
                  {enviando ? "Enviando..." : "Enviar e-mails"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}