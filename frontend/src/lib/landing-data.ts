import {
  // Gift,
  // Globe,
  ListChecks,
  // Store,
  Users,
  // Wallet,
  type LucideIcon,
} from "lucide-react";

export type Beneficio = {
  icon: LucideIcon;
  title: string;
  text: string;
  featured?: boolean;
  points?: string[];
};

// Principais funcionalidades exibidas na landing page.
// featured: cartão em destaque | points: lista de itens (opcional)
export const BENEFICIOS: Beneficio[] = [
 /* {
    icon: Wallet,
    featured: true,
    title: "Orçamentos",
    text: "Defina o limite, compare propostas e saiba exatamente quanto já gastou, quanto ainda sobra e onde dá para economizar, antes que o orçamento vire dor de cabeça.",
  },*/
  /*{
    icon: Store,
    featured: true,
    title: "Fornecedores",
    text: "Buffet, fotografia, decoração, DJ, espaço… encontre profissionais, veja o trabalho deles e peça orçamento sem sair da plataforma.",
  },*/
  {
    icon: Users,
    featured: true,
    title: "Convidados",
    text: "Envie o convite e receba a confirmação por link ou e-mail. Chega de mensagens perguntando “e aí, você vem?”.",
  },
  {
    icon: ListChecks,
    featured: true,
    title: "Tarefas",
    text: "Tarefas, responsáveis e prazos em um só lugar. Você sempre sabe o que fazer hoje e o que já está resolvido.",
  },
  /*{
    icon: Gift,
    title: "Lista de Presentes",
    text: "Monte sua lista com links de lojas ou receba contribuições por PIX. Presentear fica fácil para quem você ama.",
  },
  {
    icon: Globe,
    title: "Convites",
    text: "Crie convites, Save The Date e um site do evento com contagem regressiva. Surpreenda antes mesmo da festa começar.",
  },*/
];

// Prévia ilustrativa do painel (DADOS DEMONSTRATIVOS, não vêm do banco).
export const DEMO = {
  event: "Casamento Ana & Pedro",
  date: "21 de outubro de 2026",
  daysLeft: "124 dias",
  stats: [
    ["142", "convidados"],
    ["68%", "concluído"],
    ["18/24", "tarefas"],
  ],
  tasks: [
    ["Confirmar menu com o buffet", true],
    ["Enviar lembrete aos convidados", false],
    ["Revisar roteiro da cerimônia", false],
  ],
  nav: ["Visão geral", "Convidados", "Cronograma"],
} as const;

// Links de âncora do menu (id das seções da página inicial)
export const LINKS_MENU = [
  ["Recursos", "recursos"],
  ["Como funciona", "como-funciona"],
  ["Histórias", "historias"],
] as const;

// Atalhos por tipo de evento. O parâmetro "tipo" ainda não é lido pelo cadastro.
export const CATEGORIAS = [
  ["Casamentos", "casamento"],
  ["Aniversários", "aniversario"],
  ["Formaturas", "formatura"],
  ["Eventos especiais", "especial"],
] as const;
