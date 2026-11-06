"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEventoAtivo } from "@/context/EventoContext";
import type { ResultadoEnvio } from "@/hooks/useConvidados";
import type { Convidado } from "@/lib/convidados";
import { AlertaErro } from "@/components/ui/AlertaErro";
import { mensagemDeErro } from "@/lib/erros";

type EnviarEmailModalProps = {
  convidados: Convidado[];
  onClose: () => void;
  onEnviar: (dados: {
    convidadoIds: string[];
    assunto: string;
    mensagem: string;
  }) => Promise<ResultadoEnvio>;
  onEnviado: () => void;
};

function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome;
}

function montarMensagemPadrao(
  nomeEvento: string,
  dataISO: string,
  localCompleto: string,
  remetente: string,
): string {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const dataExtensa = new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const linhas = [
    "Olá {nome},",
    "",
    `É com muita alegria que convidamos você para o evento "${nomeEvento}"!`,
    "",
    `📅 Data: ${dataExtensa}`,
  ];
  if (localCompleto) linhas.push(`📍 Local: ${localCompleto}`);
  linhas.push(
    "",
    "Por favor, confirme sua presença clicando no link abaixo:",
    "{link_rsvp}",
    "",
    "Com carinho,",
    remetente,
  );

  return linhas.join("\n");
}

export function EnviarEmailModal({
  convidados,
  onClose,
  onEnviar,
  onEnviado,
}: EnviarEmailModalProps) {
  const { evento } = useEventoAtivo();
  const { usuario } = useAuth();

  const [aba, setAba] = useState<"compor" | "enviados">("compor");
  const [assunto, setAssunto] = useState(() => `Você está convidado! 💌 ${evento?.nome ?? ""}`);
  const [mensagem, setMensagem] = useState(() =>
    evento
      ? montarMensagemPadrao(
          evento.nome,
          evento.dataISO,
          [evento.local, evento.cidade].filter(Boolean).join(" — "),
          usuario?.nome ?? "",
        )
      : "Olá {nome},\n\nConfirme sua presença: {link_rsvp}",
  );
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoEnvio | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const comEmail = convidados.filter((c) => c.email);
  const semEmail = convidados.length - comEmail.length;
  const enviadosAntes = convidados.filter((c) => c.emailEnviadoEm !== null);
  const destinatariosVisiveis = convidados.slice(0, 5);
  const extras = convidados.length - destinatariosVisiveis.length;

  const primeiro = convidados[0];
  const nomePrevia = primeiro ? primeiroNome(primeiro.nome) : "";
  const linkPrevia = primeiro?.linkRsvp ?? "";
  const mensagemPrevia = mensagem
    .replace(/\{nome\}/g, () => nomePrevia)
    .replace(/\{link_rsvp\}/g, () => linkPrevia);

  function fechar() {
    if (enviando) return;
    if (resultado) onEnviado();
    onClose();
  }

  async function handleEnviar() {
    setErro(null);
    setEnviando(true);

    try {
      const r = await onEnviar({
        convidadoIds: convidados.map((c) => c.id),
        assunto,
        mensagem,
      });

      if (r.falhas === 0 && r.semEmail === 0) {
        onEnviado();
        onClose();
        return;
      }

      setResultado(r);
      setEnviando(false);
    } catch (err) {
      setErro(mensagemDeErro(err));
      setEnviando(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={fechar}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="font-serif text-xl font-bold text-foreground">Enviar e-mail</h2>
          <button
            onClick={fechar}
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

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
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
                {semEmail > 0 && (
                  <p className="mt-2 text-xs text-amber-700">
                    {semEmail} sem e-mail cadastrado {semEmail === 1 ? "será ignorado" : "serão ignorados"}.
                  </p>
                )}
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
                <p className="mt-2 whitespace-pre-line break-words text-sm text-foreground/80">
                  {mensagemPrevia}
                </p>
                <p className="mt-3 text-xs text-muted">
                  Cada convidado recebe o próprio link individual. A prévia mostra o do
                  primeiro destinatário.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {enviadosAntes.length === 0 && (
                <p className="py-8 text-center text-sm text-muted">Nenhum e-mail enviado ainda.</p>
              )}
              {enviadosAntes.map((c) => (
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
          <div className="border-t border-border px-4 py-4 sm:px-6">
            {resultado ? (
              <div className="space-y-3">
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <p className="font-medium">
                    {resultado.enviados} {resultado.enviados === 1 ? "e-mail enviado" : "e-mails enviados"}.
                  </p>
                  {resultado.falhas > 0 && (
                    <p>{resultado.falhas} não puderam ser enviados. Verifique os endereços e tente de novo.</p>
                  )}
                  {resultado.semEmail > 0 && (
                    <p>{resultado.semEmail} sem e-mail cadastrado foram ignorados.</p>
                  )}
                </div>
                <button
                  onClick={fechar}
                  className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <AlertaErro className="mb-3">{erro}</AlertaErro>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted">{convidados.length} destinatários</p>
                  <div className="flex gap-3">
                    <button
                      onClick={fechar}
                      disabled={enviando}
                      className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleEnviar}
                      disabled={enviando || comEmail.length === 0}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={15} />
                      {enviando ? "Enviando..." : "Enviar e-mails"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}