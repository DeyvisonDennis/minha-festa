import type { TipoEvento } from "./tipos-evento";

export type StatusRsvp = "CONFIRMADO" | "NAO_CONFIRMADO" | "PENDENTE";

export type Convidado = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  grupo: string;
  emailEnviadoEm: string | null; // data curta para exibição, ex.: "05 Jan"
  statusRsvp: StatusRsvp;
  linkRsvp: string;
};

export type NovoConvidado = {
  nome: string;
  email: string;
  telefone: string;
  grupo: string;
};

export const RSVP_CONFIG: Record<StatusRsvp, { label: string; text: string }> = {
  CONFIRMADO: { label: "Confirmado", text: "text-green-600" },
  PENDENTE: { label: "Aguardando", text: "text-amber-600" },
  NAO_CONFIRMADO: { label: "Recusado", text: "text-red-600" },
};

export const GRUPOS_POR_TIPO: Record<TipoEvento, string[]> = {
  CASAMENTO: ["Família noivo", "Família noiva", "Amigos noivo", "Amigos noiva", "Colegas de trabalho"],
  ANIVERSARIO: ["Família", "Amigos", "Colegas de trabalho", "Vizinhos"],
  CORPORATIVO: ["Equipe", "Clientes", "Parceiros", "Diretoria", "Imprensa"],
  FORMATURA: ["Família do formando", "Colegas de turma", "Professores", "Amigos"],
  DEBUTANTE: ["Família", "Amigos", "Colegas de escola", "Corte de honra"],
  OUTRO: ["Família", "Amigos", "Colegas de trabalho", "Outros"],
};

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// A API devolve a data de envio em ISO; na tela mostramos "05 Jan" no fuso do navegador.
export function formatarDataEnvio(iso: string): string {
  const data = new Date(iso);
  return `${String(data.getDate()).padStart(2, "0")} ${MESES[data.getMonth()]}`;
}

