"use client";

import { useMemo, useState } from "react";
import { Mail, Plus, Search, Check, Copy } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { AdicionarConvidadoModal } from "@/components/convidados/AdicionarConvidadoModal";
import { EnviarEmailModal } from "@/components/convidados/EnviarEmailModal";
import { useConvidados } from "@/hooks/useConvidados";
import { copiarTexto } from "@/lib/clipboard";
import {
  RSVP_CONFIG,
  type Convidado,
  type NovoConvidado,
  type StatusRsvp,
} from "@/lib/convidados";
import { normalizarTexto } from "@/lib/normalizar-texto";
import { TelaCarregando } from "@/components/ui/TelaCarregando";
import { TelaErroConexao } from "@/components/ui/TelaErroConexao";

type Filtro = "TODOS" | StatusRsvp;

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "TODOS", label: "Todos" },
  { id: "CONFIRMADO", label: "Confirmado" },
  { id: "PENDENTE", label: "Aguardando" },
  { id: "NAO_CONFIRMADO", label: "Recusado" },
];

function ConvidadosContent() {
  const { convidados, carregando, erro, recarregar, adicionarConvidado, enviarConvites } =
    useConvidados();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  const resumo = useMemo(() => {
    const total = convidados.length;
    const confirmados = convidados.filter((c) => c.statusRsvp === "CONFIRMADO").length;
    const aguardando = convidados.filter((c) => c.statusRsvp === "PENDENTE").length;
    const recusados = convidados.filter((c) => c.statusRsvp === "NAO_CONFIRMADO").length;
    const emailsEnviados = convidados.filter((c) => c.emailEnviadoEm !== null).length;
    return { total, confirmados, aguardando, recusados, emailsEnviados };
  }, [convidados]);

  const convidadosFiltrados = useMemo(() => {
    const termo = normalizarTexto(busca);
    return convidados.filter((c) => {
      const bateFiltro = filtro === "TODOS" || c.statusRsvp === filtro;
      const bateBusca =
        normalizarTexto(c.nome).includes(termo) || normalizarTexto(c.email).includes(termo);
      return bateFiltro && bateBusca;
    });
  }, [convidados, busca, filtro]);

  const convidadosRsvpPendente = convidados.filter((c) => c.statusRsvp === "PENDENTE");
  const todosSelecionadosNaTela =
    convidadosFiltrados.length > 0 && convidadosFiltrados.every((c) => selecionados.has(c.id));

  function alternarSelecao(id: string) {
    setSelecionados((atuais) => {
      const novo = new Set(atuais);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  function alternarSelecionarTodos() {
    setSelecionados((atuais) => {
      const novo = new Set(atuais);
      if (todosSelecionadosNaTela) {
        convidadosFiltrados.forEach((c) => novo.delete(c.id));
      } else {
        convidadosFiltrados.forEach((c) => novo.add(c.id));
      }
      return novo;
    });
  }

  async function handleAdicionarConvidado(dados: NovoConvidado) {
    await adicionarConvidado(dados);
    setModalAdicionar(false);
  }

  async function copiarLinkDoConvidado(convidado: Convidado) {
    const copiou = await copiarTexto(convidado.linkRsvp);
    
    if (!convidado.linkRsvp) {
      window.alert("Link indisponível no momento. Recarregue a página e tente de novo.");
      return;
    }
    
    if (!copiou) {
      // Alguns navegadores bloqueiam a cópia automática: mostra o link para copiar à mão.
      window.prompt("Copie o link do convite:", convidado.linkRsvp);
      return;
    }

    setCopiadoId(convidado.id);
    setTimeout(() => setCopiadoId((atual) => (atual === convidado.id ? null : atual)), 2000);
  }

  if (carregando) {
    return <TelaCarregando ocupaTela={false} mensagem="Carregando convidados..." />;
  }

  if (erro) {
    return (
      <TelaErroConexao
        ocupaTela={false}
        mensagem="Não foi possível carregar os convidados."
        onTentarNovamente={recarregar}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Convidados</h1>
          <p className="mt-1 text-sm text-muted">
            {resumo.total} convidados · {resumo.emailsEnviados} e-mails enviados
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setModalEmail(true)}
            disabled={convidados.length === 0}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <Mail size={16} />
            <span className="hidden sm:inline">Enviar e-mail</span>
          </button>
          <button
            onClick={() => setModalAdicionar(true)}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover sm:px-4"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="font-serif text-2xl font-bold text-foreground">{resumo.total}</p>
          <p className="text-xs text-muted">Total</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-5">
          <p className="font-serif text-2xl font-bold text-green-700">{resumo.confirmados}</p>
          <p className="text-xs text-green-700/70">Confirmados</p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-5">
          <p className="font-serif text-2xl font-bold text-amber-700">{resumo.aguardando}</p>
          <p className="text-xs text-amber-700/70">Aguardando</p>
        </div>
        <div className="rounded-2xl bg-red-50 p-5">
          <p className="font-serif text-2xl font-bold text-red-700">{resumo.recusados}</p>
          <p className="text-xs text-red-700/70">Recusados</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-white p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2]">
          <Mail size={18} className="text-foreground" />
        </span>
        <div className="min-w-50 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">E-mails enviados</p>
            <p className="text-sm text-muted">
              {resumo.emailsEnviados}/{resumo.total}
            </p>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${resumo.total > 0 ? (resumo.emailsEnviados / resumo.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
        {convidadosRsvpPendente.length > 0 && (
          <button
            onClick={() => {
              setSelecionados(new Set(convidadosRsvpPendente.map((c) => c.id)));
              setModalEmail(true);
            }}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Enviar para {convidadosRsvpPendente.length} pendentes
          </button>
        )}
      </div>

      {selecionados.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-primary px-4 py-3 text-white sm:px-5">
          <p className="text-sm font-medium">
            {selecionados.size} selecionado{selecionados.size > 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setModalEmail(true)}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/15 px-4 py-1.5 text-sm font-medium hover:bg-white/25"
            >
              <Mail size={15} />
              Enviar e-mail
            </button>
            <button
              onClick={() => setSelecionados(new Set())}
              className="cursor-pointer text-sm font-medium text-white/90 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-55 flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
          {FILTROS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFiltro(id)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition ${
                filtro === id ? "bg-[#3d2b1f] text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#FAF7F2]/60 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={todosSelecionadosNaTela}
                    onChange={alternarSelecionarTodos}
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-3 py-3">Nome</th>
                <th className="px-3 py-3">E-mail</th>
                <th className="hidden px-3 py-3 sm:table-cell">Grupo</th>
                <th className="px-3 py-3">E-mail enviado</th>
                <th className="px-3 py-3">RSVP</th>
                <th className="px-3 py-3">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {convidadosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted">
                    {convidados.length === 0
                      ? "Você ainda não cadastrou convidados. Clique em Adicionar para começar."
                      : "Nenhum convidado encontrado."}
                  </td>
                </tr>
              )}
              {convidadosFiltrados.map((convidado) => {
                const rsvpInfo = RSVP_CONFIG[convidado.statusRsvp];
                return (
                  <tr key={convidado.id} className="hover:bg-black/2">
                    <td className="px-5 py-3.5">
                      <input
                        type="checkbox"
                        checked={selecionados.has(convidado.id)}
                        onChange={() => alternarSelecao(convidado.id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-sm font-semibold text-foreground">
                          {convidado.nome[0]}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{convidado.nome}</p>
                          {convidado.telefone && (
                            <p className="truncate text-xs text-muted">{convidado.telefone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-muted">{convidado.email || "—"}</td>
                    <td className="hidden px-3 py-3.5 sm:table-cell">
                      {convidado.grupo ? (
                        <span className="rounded-full bg-[#FAF7F2] px-2.5 py-1 text-xs text-muted">
                          {convidado.grupo}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5">
                      {convidado.emailEnviadoEm ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                          <Check size={13} />
                          {convidado.emailEnviadoEm}
                        </span>
                      ) : convidado.email ? (
                        <button
                          onClick={() => {
                            setSelecionados(new Set([convidado.id]));
                            setModalEmail(true);
                          }}
                          className="cursor-pointer text-xs font-medium text-primary underline-offset-2 hover:underline"
                        >
                          Enviar
                        </button>
                      ) : (
                        <span className="text-xs text-muted">Sem e-mail</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={`text-xs font-semibold ${rsvpInfo.text}`}>
                        {rsvpInfo.label}
                      </span>
                    </td>
                      <td className="px-3 py-3.5">
                        <button
                          onClick={() => copiarLinkDoConvidado(convidado)}
                          title="Copiar o link individual do convite"
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-black/5"
                        >
                          {copiadoId === convidado.id ? (
                            <Check size={13} className="text-green-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                          <span className="hidden sm:inline">
                            {copiadoId === convidado.id ? "Copiado!" : "Copiar"}
                          </span>
                        </button>
                      </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalAdicionar && (
        <AdicionarConvidadoModal
          onClose={() => setModalAdicionar(false)}
          onAdicionar={handleAdicionarConvidado}
        />
      )}

      {modalEmail && (
        <EnviarEmailModal
          convidados={
            selecionados.size > 0
              ? convidados.filter((c) => selecionados.has(c.id))
              : convidados
          }
          onClose={() => setModalEmail(false)}
          onEnviar={enviarConvites}
          onEnviado={() => setSelecionados(new Set())}
        />
      )}
    </div>
  );
}

export default function ConvidadosPage() {
  return (
    <AppShell>
      <ConvidadosContent />
    </AppShell>
  );
}