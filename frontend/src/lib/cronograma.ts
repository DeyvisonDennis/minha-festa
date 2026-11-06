export type StatusTarefa = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
export type Prioridade = "ALTA" | "MEDIA" | "BAIXA";

export type Tarefa = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  prazoISO: string; // AAAA-MM-DD
  status: StatusTarefa;
  prioridade: Prioridade;
};

// Dados para criar uma tarefa. O status inicial é sempre "A fazer".
export type NovaTarefa = Omit<Tarefa, "id" | "status">;

export const CATEGORIAS_TAREFA = [
  "Fornecedor",
  "Catering",
  "Moda",
  "Convites",
  "Financeiro",
  "Música",
  "Decoração",
  "Logística",
  "Digital",
];

export const STATUS_CONFIG: Record<StatusTarefa, { label: string; bg: string; text: string; dot: string }> = {
  PENDENTE: { label: "A fazer", bg: "bg-[#FAF7F2]", text: "text-foreground", dot: "bg-foreground" },
  EM_ANDAMENTO: { label: "Em andamento", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-600" },
  CONCLUIDA: { label: "Concluído", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  CANCELADA: { label: "Cancelada", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

export const PRIORIDADE_COR: Record<Prioridade, string> = {
  ALTA: "bg-red-500",
  MEDIA: "bg-amber-500",
  BAIXA: "bg-green-500",
};

export function formatarDataCurta(iso: string): { dia: string; mes: string } {
  const [, mes, dia] = iso.split("-");
  const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return { dia, mes: nomesMeses[parseInt(mes, 10) - 1] };
}