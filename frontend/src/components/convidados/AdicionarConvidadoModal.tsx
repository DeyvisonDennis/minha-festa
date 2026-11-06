"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useEventoAtivo } from "@/context/EventoContext";
import { GRUPOS_POR_TIPO, type NovoConvidado } from "@/lib/convidados";
import { formatarTelefone } from "@/lib/format";
import { AlertaErro } from "@/components/ui/AlertaErro";
import { mensagemDeErro } from "@/lib/erros";

type AdicionarConvidadoModalProps = {
  onClose: () => void;
  onAdicionar: (dados: NovoConvidado) => Promise<void>;
};

export function AdicionarConvidadoModal({
  onClose,
  onAdicionar,
}: AdicionarConvidadoModalProps) {
  const { evento } = useEventoAtivo();
  const grupos = GRUPOS_POR_TIPO[evento?.tipo ?? "OUTRO"];

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [grupo, setGrupo] = useState(grupos[0]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;

    setErro(null);
    setSalvando(true);

    try {
      await onAdicionar({ nome, email, telefone, grupo });
    } catch (err) {
      setErro(mensagemDeErro(err));
      setSalvando(false);
    }
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
        <h2 className="font-serif text-xl font-bold text-foreground">Adicionar convidado</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Nome completo</label>
            <input
              type="text"
              required
              autoFocus
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
              {grupos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <AlertaErro>{erro}</AlertaErro>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={salvando}
              className="flex-1 cursor-pointer rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-black/5 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}