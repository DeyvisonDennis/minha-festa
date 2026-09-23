"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatarTelefone } from "@/lib/format";

const GRUPOS_SUGERIDOS = [
  "Família noivo",
  "Família noiva",
  "Amigos noivo",
  "Amigos noiva",
  "Colegas trabalho",
];

type AdicionarConvidadoModalProps = {
  onClose: () => void;
  onAdicionar: (dados: {
    nome: string;
    email: string;
    telefone: string;
    grupo: string;
  }) => void;
};

export function AdicionarConvidadoModal({
  onClose,
  onAdicionar,
}: AdicionarConvidadoModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [grupo, setGrupo] = useState(GRUPOS_SUGERIDOS[0]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    onAdicionar({ nome, email, telefone, grupo });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-xl font-bold text-foreground">
          Adicionar convidado
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Nome completo</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Telefone</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              placeholder="(11) 99999-0000"
              className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Grupo</label>
            <select
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              className="mt-1 w-full cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              {GRUPOS_SUGERIDOS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-black/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}