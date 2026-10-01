"use client";

import { useEffect, useRef, useState } from "react";
import { STATUS_CONFIG, type StatusTarefa } from "@/lib/mock-cronograma";

const OPCOES: StatusTarefa[] = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"];

type StatusSelectProps = {
  status: StatusTarefa;
  onChange: (status: StatusTarefa) => void;
};

export function StatusSelect({ status, onChange }: StatusSelectProps) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const statusInfo = STATUS_CONFIG[status];

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
      >
        {statusInfo.label}
      </button>

      {aberto && (
        <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          {OPCOES.map((opcao) => {
            const info = STATUS_CONFIG[opcao];
            return (
              <button
                key={opcao}
                type="button"
                onClick={() => {
                  onChange(opcao);
                  setAberto(false);
                }}
                className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs hover:bg-black/5 ${
                  opcao === status ? "font-semibold" : ""
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${info.dot}`} />
                {info.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}