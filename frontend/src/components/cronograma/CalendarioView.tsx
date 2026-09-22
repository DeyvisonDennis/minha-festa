"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TAREFAS_MOCK, STATUS_CONFIG } from "@/lib/mock-cronograma";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const NOMES_MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function isoLocal(ano: number, mes: number, dia: number): string {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function CalendarioView() {
  // Mês inicial baseado na primeira tarefa do mock, só para a demonstração
  // já abrir num mês com dados visíveis. Com dados reais, isso viraria
  // simplesmente o mês atual (new Date()).
  const [referencia, setReferencia] = useState(() => {
    const primeira = TAREFAS_MOCK[0]?.prazoISO ?? new Date().toISOString();
    const [ano, mes] = primeira.split("-").map(Number);
    return new Date(ano, mes - 1, 1);
  });

  const hojeISO = useMemo(() => {
    const hoje = new Date();
    return isoLocal(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  }, []);

  const tarefasPorDia = useMemo(() => {
    const mapa = new Map<string, typeof TAREFAS_MOCK>();
    for (const tarefa of TAREFAS_MOCK) {
      const lista = mapa.get(tarefa.prazoISO) ?? [];
      lista.push(tarefa);
      mapa.set(tarefa.prazoISO, lista);
    }
    return mapa;
  }, []);

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

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <button
          onClick={() => mudarMes(-1)}
          className="flex cursor-pointer items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-black/5"
        >
          <ChevronLeft size={15} />
          {NOMES_MESES[(mes + 11) % 12]}
        </button>

        <p className="font-serif text-lg font-bold text-foreground">
          {NOMES_MESES[mes]} {ano}
        </p>

        <button
          onClick={() => mudarMes(1)}
          className="flex cursor-pointer items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-black/5"
        >
          {NOMES_MESES[(mes + 1) % 12]}
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-border">
        {DIAS_SEMANA.map((dia) => (
          <div
            key={dia}
            className="px-2 py-2.5 text-center text-xs font-medium text-muted"
          >
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {celulas.map((celula, index) => {
          if (!celula) {
            return <div key={`vazio-${index}`} className="min-h-[96px] border-b border-r border-border" />;
          }

          const tarefasDoDia = tarefasPorDia.get(celula.iso) ?? [];
          const ehHoje = celula.iso === hojeISO;

          return (
            <div
              key={celula.iso}
              className="min-h-[96px] border-b border-r border-border p-2"
            >
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
            </div>
          );
        })}
      </div>
    </div>
  );
}