import type { TipoEvento } from "./tipos-evento";

export type OpcaoCapa = {
  id: string;
  url: string;
  label: string;
};

export const OPCOES_CAPA: OpcaoCapa[] = [
  {
    id: "mesa-elegante",
    url: "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    label: "Mesa elegante com velas",
  },
  {
    id: "confete",
    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    label: "Confete colorido",
  },
  {
    id: "luzes-noturnas",
    url: "https://images.unsplash.com/photo-1550305080-4e029753abcf?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    label: "Luzes e celebração noturna",
  },
  {
    id: "formatura",
    url: "https://images.unsplash.com/photo-1695425173758-37e9c23b962a?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    label: "Capelos de formatura",
  },
  {
    id: "baloes-rosa",
    url: "https://images.unsplash.com/photo-1509909756405-be0199881695?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    label: "Balões em tons de rosa",
  },
  {
    id: "baloes-coloridos",
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    label: "Balões coloridos",
  },
  {
    id: "espelhos-disco",
    url: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    label: "Festa com luzes de espelho",
  },
  {
    id: "baloes-mao",
    url: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    label: "Balões soltos ao ar livre",
  },
];

// Sugestão automática ao criar o evento, conforme o tipo escolhido no
// onboarding. O usuário pode trocar livremente depois pela galeria completa.
export const CAPA_SUGERIDA_POR_TIPO: Record<TipoEvento, string> = {
  CASAMENTO: "mesa-elegante",
  ANIVERSARIO: "confete",
  CORPORATIVO: "luzes-noturnas",
  FORMATURA: "formatura",
  DEBUTANTE: "baloes-rosa",
  OUTRO: "baloes-coloridos",
};

export function obterUrlCapa(id: string): string {
  return OPCOES_CAPA.find((o) => o.id === id)?.url ?? OPCOES_CAPA[0].url;
}