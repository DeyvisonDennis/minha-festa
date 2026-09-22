// EVENTO_MOCK.imagemCapaUrl é provisório: o banco já tem o campo
// `imagem_capa_url` pronto na tabela `eventos` para quando implementarmos
// upload de imagem de capa, na etapa de Gestão de Eventos.

export const EVENTO_MOCK = {
  tipo: "Casamento",
  nome: "Casamento Ana & Pedro",
  dataFormatada: "15 de Março de 2025",
  local: "Espaço Villa d'Este · São Paulo, SP",
  diasRestantes: 127,
  convidados: 150,
  orcamento: 65000,
  tarefas: 10,
};

export const STATS_MOCK = [
  {
    label: "Convidados confirmados",
    valor: "87",
    meta: "de 150",
    progresso: 58,
    cor: "bg-[#8b6f47]",
  },
  {
    label: "Orçamento utilizado",
    valor: "R$ 38.400",
    meta: "de R$ 65.000",
    progresso: 59,
    cor: "bg-[#c98a3e]",
  },
  {
    label: "Tarefas concluídas",
    valor: "2",
    meta: "de 10",
    progresso: 20,
    cor: "bg-[#5a8a5a]",
  },
  {
    label: "Fornecedores fechados",
    valor: "7",
    meta: "de 12",
    progresso: 58,
    cor: "bg-[#6b5ca5]",
  },
];

export const TAREFAS_MOCK = [
  {
    dia: "15",
    mes: "Jan",
    titulo: "Reunião com floricultura Bella Rose",
    categoria: "Fornecedor",
  },
  {
    dia: "18",
    mes: "Jan",
    titulo: "Degustação menu — Espaço Villa d'Este",
    categoria: "Catering",
  },
  {
    dia: "22",
    mes: "Jan",
    titulo: "Prova do vestido — 2ª prova",
    categoria: "Moda",
  },
  {
    dia: "28",
    mes: "Jan",
    titulo: "Envio convites digitais (lote 2)",
    categoria: "Convites",
  },
  {
    dia: "02",
    mes: "Fev",
    titulo: "Pagamento DJ — 2ª parcela",
    categoria: "Financeiro",
  },
];

export const RSVPS_MOCK = [
  { nome: "Marcos Oliveira", email: "marcos@email.com", status: "Confirmado" },
  { nome: "Juliana Costa", email: "juliana@email.com", status: "Aguardando" },
  { nome: "Rafael Pereira", email: "rafael@email.com", status: "Confirmado" },
  { nome: "Camila Torres", email: "camila@email.com", status: "Recusado" },
];

export const RSVP_RESUMO_MOCK = {
  confirmados: 87,
  aguardando: 41,
  recusados: 22,
};