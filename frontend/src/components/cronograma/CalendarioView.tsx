"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STATUS_CONFIG, type StatusTarefa, type Tarefa } from "@/lib/mock-cronograma";
import { DiaDetalheModal } from "./DiaDetalheModal";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const NOMES_MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function isoLocal(ano: number, mes: number, dia: number): string {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

type CalendarioViewProps = {
  tarefas: Tarefa[];
  onAlterarStatus: (id: string, status: StatusTarefa) => void;
  onAdicionarTarefa: (tarefa: Omit<Tarefa, "id">) => void;
};

export function CalendarioView({
  tarefas,
  onAlterarStatus,
  onAdicionarTarefa,
}: CalendarioViewProps) {
  const [referencia, setReferencia] = useState(() => {
    const primeira = tarefas[0]?.prazoISO ?? new Date().toISOString();
    const [ano, mes] = primeira.split("-").map(Number);
    return new Date(ano, mes - 1, 1);
  });
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  const hojeISO = useMemo(() => {
    const hoje = new Date();
    return isoLocal(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  }, []);

  const tarefasPorDia = useMemo(() => {
    const mapa = new Map<string, Tarefa[]>();
    for (const tarefa of tarefas) {
      const lista = mapa.get(tarefa.prazoISO) ?? [];
      lista.push(tarefa);
      mapa.set(tarefa.prazoISO, lista);
    }
    return mapa;
  }, [tarefas]);

  const ano = referencia.getFullYear();
  const mes = referencia.getMonth();

  const celulas = useMemo(() => {
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    const lista: Array<{ dia: number; iso: string } | null> = [];
    for (let i = 0; i < primeiroDiaSemana; i++) lista.push(null);
    for (let dia = 1; dia <= totalDias; dia++) {
      lista.push({ dia, iso: isoLocal(ano, mes, dia) });
    }
    return lista;
  }, [ano, mes]);

  function mudarMes(delta: number) {
    setReferencia(new Date(ano, mes + delta, 1));
  }

  function formatarDataCompleta(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    const data = new Date(y, m - 1, d);
    const texto = data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  const tarefasDoDiaSelecionado = diaSelecionado
    ? tarefasPorDia.get(diaSelecionado) ?? []
    : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <button
          onClick={() => mudarMes(-1)}
          className="flex cursor-pointer items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground hover:bg-black/5 sm:px-3 sm:text-sm"
        >
          <ChevronLeft size={15} />
          <span className="hidden min-[420px]:inline">{NOMES_MESES[(mes + 11) % 12]}</span>
        </button>

        <p className="font-serif text-lg font-bold text-foreground">
          {NOMES_MESES[mes]} {ano}
        </p>

        <button
          onClick={() => mudarMes(-1)}
          className="flex cursor-pointer items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground hover:bg-black/5 sm:px-3 sm:text-sm"
        >
          <ChevronLeft size={15} />
          <span className="hidden min-[420px]:inline">{NOMES_MESES[(mes + 11) % 12]}</span>
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-border">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="px-2 py-2.5 text-center text-xs font-medium text-muted">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {celulas.map((celula, index) => {
          if (!celula) {
            return <div key={`vazio-${index}`} className="min-h-[64px] border-b border-r border-border sm:min-h-[96px]" />;
          }

          const tarefasDoDia = tarefasPorDia.get(celula.iso) ?? [];
          const ehHoje = celula.iso === hojeISO;

          return (
            <button
              key={celula.iso}
              onClick={() => setDiaSelecionado(celula.iso)}
              className="min-h-[64px] border-b border-r border-border p-1.5 sm:min-h-[96px] sm:p-2">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  ehHoje ? "bg-foreground text-white" : "text-foreground"
                }`}
              >
                {celula.dia}
              </span>

              <div className="mt-1 space-y-1">
                {tarefasDoDia.slice(0, 2).map((tarefa) => {
                  const statusInfo = STATUS_CONFIG[tarefa.status];
                  return (
                    <p
                      key={tarefa.id}
                      title={tarefa.titulo}
                      className={`truncate rounded px-1.5 py-0.5 text-[11px] font-medium ${statusInfo.bg} ${statusInfo.text}`}
                    >
                      {tarefa.titulo}
                    </p>
                  );
                })}
                {tarefasDoDia.length > 2 && (
                  <p className="px-1.5 text-[11px] text-muted">
                    +{tarefasDoDia.length - 2} mais
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {diaSelecionado && (
        <DiaDetalheModal
          dataISO={diaSelecionado}
          dataFormatada={formatarDataCompleta(diaSelecionado)}
          tarefas={tarefasDoDiaSelecionado}
          onClose={() => setDiaSelecionado(null)}
          onAlterarStatus={onAlterarStatus}
          onAdicionarTarefa={onAdicionarTarefa}
        />
      )}
    </div>
  );
}