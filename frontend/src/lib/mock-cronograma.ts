export type StatusTarefa = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
export type Prioridade = "ALTA" | "MEDIA" | "BAIXA";

export type Tarefa = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  prazoISO: string; // YYYY-MM-DD
  status: StatusTarefa;
  prioridade: Prioridade;
  responsavel: string;
};

// Mock alinhado à tabela `tarefas` do banco — será substituído por dados
// reais quando implementarmos a Gestão de Eventos + API de Cronograma.
export const TAREFAS_MOCK: Tarefa[] = [
  { id: "1", titulo: "Confirmar menu degustação", descricao: "Marcar visita ao Buffet Chef Marco", categoria: "Catering", prazoISO: "2026-01-18", status: "PENDENTE", prioridade: "ALTA", responsavel: "Ana Souza" },
  { id: "2", titulo: "Reunião com floricultura Bella Rose", descricao: "Definir arranjos e buquê", categoria: "Fornecedor", prazoISO: "2026-01-15", status: "PENDENTE", prioridade: "ALTA", responsavel: "Ana Souza" },
  { id: "3", titulo: "Enviar convites lote 2 (família)", descricao: "87 convites pendentes", categoria: "Convites", prazoISO: "2026-01-28", status: "PENDENTE", prioridade: "MEDIA", responsavel: "Pedro Lima" },
  { id: "4", titulo: "Criar site do evento", descricao: "Publicar página com RSVP", categoria: "Digital", prazoISO: "2026-02-05", status: "PENDENTE", prioridade: "MEDIA", responsavel: "Pedro Lima" },
  { id: "5", titulo: "Definir cardápio infantil", descricao: "Alinhar com o buffet", categoria: "Catering", prazoISO: "2026-01-20", status: "PENDENTE", prioridade: "BAIXA", responsavel: "Ana Souza" },
  { id: "6", titulo: "Reservar hospedagem para família", descricao: "Bloco de quartos no hotel parceiro", categoria: "Logística", prazoISO: "2026-01-30", status: "PENDENTE", prioridade: "BAIXA", responsavel: "Ana Souza" },
  { id: "7", titulo: "Prova do vestido — 2ª prova", descricao: "Atelier Luna Branca — 14h", categoria: "Moda", prazoISO: "2026-01-22", status: "EM_ANDAMENTO", prioridade: "ALTA", responsavel: "Ana Souza" },
  { id: "8", titulo: "Contratar cerimonialista", descricao: "Fechar contrato e sinal", categoria: "Fornecedor", prazoISO: "2026-01-20", status: "EM_ANDAMENTO", prioridade: "ALTA", responsavel: "Ana Souza" },
  { id: "9", titulo: "Fechar contrato DJ", descricao: "Revisar cláusulas e assinar", categoria: "Música", prazoISO: "2026-01-10", status: "CONCLUIDA", prioridade: "ALTA", responsavel: "Pedro Lima" },
  { id: "10", titulo: "Pagamento fotógrafo — sinal 40%", descricao: "Transferência R$ 2.600", categoria: "Financeiro", prazoISO: "2026-01-08", status: "CONCLUIDA", prioridade: "ALTA", responsavel: "Pedro Lima" },
];

export const STATUS_CONFIG: Record<
  StatusTarefa,
  { label: string; bg: string; text: string; dot: string }
> = {
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