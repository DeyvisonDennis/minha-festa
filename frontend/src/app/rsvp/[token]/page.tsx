"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, Check, MapPin, X } from "lucide-react";
import { AlertaErro } from "@/components/ui/AlertaErro";
import { TelaCarregando } from "@/components/ui/TelaCarregando";
import { TelaErroConexao } from "@/components/ui/TelaErroConexao";
import { ApiError, apiFetch } from "@/lib/api";
import { formatarDataExtensa } from "@/lib/datas";
import { mensagemDeErro } from "@/lib/erros";
import type { ConviteRsvp, RespostaRsvp } from "@/lib/rsvp";
import { TIPO_EVENTO_CONFIG } from "@/lib/tipos-evento";

type Carga =
  | { tipo: "carregando" }
  | { tipo: "pronto"; convite: ConviteRsvp }
  | { tipo: "invalido" }
  | { tipo: "erro" };

export default function RsvpPage() {
  const { token } = useParams<{ token: string }>();

  const [carga, setCarga] = useState<Carga>({ tipo: "carregando" });
  const [tentativa, setTentativa] = useState(0);
  const [alterando, setAlterando] = useState(false);
  const [enviando, setEnviando] = useState<RespostaRsvp | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        const convite = await apiFetch<ConviteRsvp>(`/rsvp/${token}`);
        if (!cancelado) setCarga({ tipo: "pronto", convite });
      } catch (err) {
        if (cancelado) return;
        // 404 (não existe) e 400 (token mal formado) significam link errado.
        // Qualquer outra falha é de conexão, e vale tentar de novo.
        const linkInvalido =
          err instanceof ApiError && (err.status === 404 || err.status === 400);
        setCarga({ tipo: linkInvalido ? "invalido" : "erro" });
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [token, tentativa]);

  function tentarNovamente() {
    setCarga({ tipo: "carregando" });
    setTentativa((n) => n + 1);
  }

  async function responder(resposta: RespostaRsvp) {
    setErro(null);
    setEnviando(resposta);

    try {
      const convite = await apiFetch<ConviteRsvp>(`/rsvp/${token}`, {
        method: "POST",
        body: JSON.stringify({ resposta }),
      });
      setCarga({ tipo: "pronto", convite });
      setAlterando(false);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEnviando(null);
    }
  }

  if (carga.tipo === "carregando") return <TelaCarregando />;

  if (carga.tipo === "erro") {
    return <TelaErroConexao onTentarNovamente={tentarNovamente} />;
  }

  if (carga.tipo === "invalido") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#FAF7F2] px-6 text-center">
        <span className="text-4xl">💌</span>
        <h1 className="font-serif text-xl font-bold text-foreground">Convite não encontrado</h1>
        <p className="max-w-sm text-sm text-muted">
          Este link não é válido ou foi digitado incorretamente. Confira o e-mail ou a mensagem
          que você recebeu, ou peça um novo link a quem organizou a festa.
        </p>
      </div>
    );
  }

  const { convidado, evento } = carga.convite;
  const tipoInfo = TIPO_EVENTO_CONFIG[evento.tipo] ?? TIPO_EVENTO_CONFIG.OUTRO;
  const local = [evento.local, evento.cidade].filter(Boolean).join(" · ");
  const respondeu = convidado.statusRsvp !== "PENDENTE";
  const confirmado = convidado.statusRsvp === "CONFIRMADO";
  const mostrarBotoes = !respondeu || alterando;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-[#3d2b1f] to-[#7c5a41] sm:h-72">
        {evento.imagemCapaUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={evento.imagemCapaUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative mx-auto flex h-full max-w-lg flex-col justify-end px-6 pb-14 text-white">
          <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            {tipoInfo.emoji} {tipoInfo.label}
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold">{evento.nome}</h1>
        </div>
      </header>

      <main className="relative mx-auto -mt-8 max-w-lg px-4 pb-12">
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-muted">Olá, {convidado.primeiroNome}!</p>
          <h2 className="mt-1 font-serif text-xl font-bold text-foreground">
            Você está convidado(a)
          </h2>

          <div className="mt-5 space-y-3 text-sm text-foreground">
            <p className="flex items-start gap-2">
              <CalendarDays size={16} className="mt-0.5 shrink-0 text-muted" />
              {formatarDataExtensa(evento.dataISO)}
            </p>
            {local && (
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-muted" />
                {local}
              </p>
            )}
          </div>

          <div className="my-6 h-px bg-border" />

          {respondeu && !alterando && (
            <div className="space-y-4">
              <div
                className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${
                  confirmado ? "bg-green-50 text-green-800" : "bg-[#FAF7F2] text-foreground"
                }`}
              >
                {confirmado ? (
                  <Check size={18} className="mt-0.5 shrink-0" />
                ) : (
                  <X size={18} className="mt-0.5 shrink-0" />
                )}
                <p>
                  {confirmado
                    ? `Presença confirmada! Obrigado por avisar, ${convidado.primeiroNome}. Estamos ansiosos para te ver.`
                    : `Resposta registrada. Sentiremos sua falta, ${convidado.primeiroNome}.`}
                </p>
              </div>
              <button
                onClick={() => setAlterando(true)}
                className="cursor-pointer text-sm font-medium text-muted underline underline-offset-2 hover:text-foreground"
              >
                Alterar resposta
              </button>
            </div>
          )}

          {mostrarBotoes && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Você poderá comparecer?</p>
              <button
                onClick={() => responder("CONFIRMADO")}
                disabled={enviando !== null}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={16} />
                {enviando === "CONFIRMADO" ? "Enviando..." : "Confirmo presença"}
              </button>
              <button
                onClick={() => responder("NAO_CONFIRMADO")}
                disabled={enviando !== null}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-medium text-foreground hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={16} />
                {enviando === "NAO_CONFIRMADO" ? "Enviando..." : "Não poderei ir"}
              </button>
              <AlertaErro className="mt-1">{erro}</AlertaErro>
              {alterando && (
                <button
                  onClick={() => {
                    setAlterando(false);
                    setErro(null);
                  }}
                  disabled={enviando !== null}
                  className="w-full cursor-pointer text-sm text-muted hover:text-foreground disabled:opacity-60"
                >
                  Cancelar
                </button>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">Minha Festa</p>
      </main>
    </div>
  );
}