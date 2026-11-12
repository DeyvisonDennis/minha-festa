"use client";

import { useState } from "react";
import { useEventoAtivo, type EventoAtivo } from "@/context/EventoContext";
import { formatarDataResumida } from "@/lib/datas";
import { mensagemDeErro } from "@/lib/erros";
import { ORDEM_TIPOS, TIPO_EVENTO_CONFIG, type TipoEvento } from "@/lib/tipos-evento";
import { AlertaErro } from "@/components/ui/AlertaErro";
import { AlertaSucesso } from "@/components/ui/AlertaSucesso";
import { MoneyInput } from "@/components/ui/MoneyInput";

const CLASSE_INPUT =
  "mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary";

type Formulario = {
  nome: string;
  tipo: TipoEvento;
  dataISO: string;
  convidados: string;
  local: string;
  cidade: string;
  orcamento: number | undefined;
};

function paraFormulario(e: EventoAtivo): Formulario {
  return {
    nome: e.nome,
    tipo: e.tipo,
    dataISO: e.dataISO,
    convidados: e.convidadosEstimados !== undefined ? String(e.convidadosEstimados) : "",
    local: e.local ?? "",
    cidade: e.cidade ?? "",
    // Orçamento zero aparece como campo vazio ("não definido").
    orcamento: e.orcamento > 0 ? e.orcamento : undefined,
  };
}

function iguais(a: Formulario, b: Formulario): boolean {
  return (
    a.nome.trim() === b.nome &&
    a.tipo === b.tipo &&
    a.dataISO === b.dataISO &&
    a.convidados.trim() === b.convidados &&
    a.local.trim() === b.local &&
    a.cidade.trim() === b.cidade &&
    (a.orcamento ?? 0) === (b.orcamento ?? 0)
  );
}

export function EventoForm({ evento }: { evento: EventoAtivo }) {
  const { atualizarEvento } = useEventoAtivo();

  const [form, setForm] = useState<Formulario>(() => paraFormulario(evento));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const alterado = !iguais(form, paraFormulario(evento));

  function mudar<K extends keyof Formulario>(campo: K, valor: Formulario[K]) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setOk(null);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setOk(null);
    setSalvando(true);

    try {
      const atualizado = await atualizarEvento({
        tipo: form.tipo,
        nome: form.nome,
        dataISO: form.dataISO,
        convidadosEstimados: form.convidados.trim() ? Number(form.convidados) : undefined,
        local: form.local,
        cidade: form.cidade,
        orcamento: form.orcamento ?? 0,
      });
      setForm(paraFormulario(atualizado));
      setOk("Alterações salvas.");
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={salvar} className="rounded-2xl border border-border bg-white p-6">
      <h2 className="text-base font-semibold text-foreground">Configurações do evento ativo</h2>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#F5F0EA] px-4 py-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{evento.nome}</p>
          <p className="mt-0.5 text-xs text-muted">
            Evento ativo · {formatarDataResumida(evento.dataISO)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
          Ativo
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="evento-nome" className="text-sm font-medium text-foreground">
            Nome do evento
          </label>
          <input
            id="evento-nome"
            type="text"
            required
            maxLength={180}
            value={form.nome}
            onChange={(e) => mudar("nome", e.target.value)}
            className={CLASSE_INPUT}
          />
        </div>

        <div>
          <label htmlFor="evento-tipo" className="text-sm font-medium text-foreground">
            Tipo
          </label>
          <select
            id="evento-tipo"
            value={form.tipo}
            onChange={(e) => mudar("tipo", e.target.value as TipoEvento)}
            className={`${CLASSE_INPUT} cursor-pointer bg-white`}
          >
            {ORDEM_TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_EVENTO_CONFIG[tipo].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="evento-data" className="text-sm font-medium text-foreground">
            Data do evento
          </label>
          <input
            id="evento-data"
            type="date"
            required
            value={form.dataISO}
            onChange={(e) => mudar("dataISO", e.target.value)}
            className={`${CLASSE_INPUT} cursor-pointer`}
          />
        </div>

        <div>
          <label htmlFor="evento-convidados" className="text-sm font-medium text-foreground">
            Número de convidados
          </label>
          <input
            id="evento-convidados"
            type="number"
            min={0}
            max={100000}
            value={form.convidados}
            onChange={(e) => mudar("convidados", e.target.value)}
            placeholder="150"
            className={CLASSE_INPUT}
          />
        </div>

        <div>
          <label htmlFor="evento-local" className="text-sm font-medium text-foreground">
            Local
          </label>
          <input
            id="evento-local"
            type="text"
            maxLength={255}
            value={form.local}
            onChange={(e) => mudar("local", e.target.value)}
            placeholder="Ex: Espaço Villa d'Este"
            className={CLASSE_INPUT}
          />
        </div>

        <div>
          <label htmlFor="evento-cidade" className="text-sm font-medium text-foreground">
            Cidade
          </label>
          <input
            id="evento-cidade"
            type="text"
            maxLength={100}
            value={form.cidade}
            onChange={(e) => mudar("cidade", e.target.value)}
            placeholder="São Paulo, SP"
            className={CLASSE_INPUT}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="evento-orcamento" className="text-sm font-medium text-foreground">
            Orçamento total
          </label>
          <MoneyInput
            id="evento-orcamento"
            value={form.orcamento}
            onChange={(valor) => mudar("orcamento", valor)}
          />
        </div>
      </div>

      <AlertaErro className="mt-5">{erro}</AlertaErro>
      <AlertaSucesso className="mt-5">{ok}</AlertaSucesso>

      <div className="mt-6 flex justify-end border-t border-border pt-5">
        <button
          type="submit"
          disabled={!alterado || salvando}
          className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}