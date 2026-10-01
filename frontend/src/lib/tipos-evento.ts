export type TipoEvento =
  | "CASAMENTO"
  | "ANIVERSARIO"
  | "CORPORATIVO"
  | "FORMATURA"
  | "DEBUTANTE"
  | "OUTRO";

export const TIPO_EVENTO_CONFIG: Record < TipoEvento,
  { label: string; descricao: string; emoji: string }
> = {
  CASAMENTO: { label: "Casamento", descricao: "Cerimônia e recepção", emoji: "💍" },
  ANIVERSARIO: { label: "Aniversário", descricao: "Festa de aniversário", emoji: "🎂" },
  CORPORATIVO: { label: "Corporativo", descricao: "Evento empresarial", emoji: "🏢" },
  FORMATURA: { label: "Formatura", descricao: "Cerimônia de formatura", emoji: "🎓" },
  DEBUTANTE: { label: "Debutante", descricao: "Festa dos 15 anos", emoji: "👑" },
  OUTRO: { label: "Outro", descricao: "Outro tipo de evento", emoji: "🎉" },
};

export const ORDEM_TIPOS: TipoEvento[] = [
  "CASAMENTO", "ANIVERSARIO", "CORPORATIVO", "FORMATURA", "DEBUTANTE", "OUTRO",
];