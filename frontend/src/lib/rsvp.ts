import type { StatusRsvp } from "@/lib/convidados";
import type { TipoEvento } from "@/lib/tipos-evento";

// Resposta das rotas públicas GET e POST /rsvp/:token
export type ConviteRsvp = {
  convidado: { primeiroNome: string; statusRsvp: StatusRsvp };
  evento: {
    nome: string;
    tipo: TipoEvento;
    dataISO: string;
    local?: string;
    cidade?: string;
    imagemCapaUrl?: string;
  };
};

export type RespostaRsvp = "CONFIRMADO" | "NAO_CONFIRMADO";