import type { status_rsvp } from '../generated/prisma/enums';

// Só o que a página pública precisa. Nada de e-mail, telefone ou outros convidados.
export const SELECAO_CONVITE = {
  id: true,
  nome: true,
  status_rsvp: true,
  eventos: {
    select: {
      nome_evento: true,
      tipo_evento: true,
      data_evento: true,
      local: true,
      cidade: true,
      imagem_capa_url: true,
    },
  },
} as const;

type ConviteBruto = {
  nome: string;
  status_rsvp: status_rsvp;
  eventos: {
    nome_evento: string;
    tipo_evento: string | null;
    data_evento: Date;
    local: string | null;
    cidade: string | null;
    imagem_capa_url: string | null;
  };
};

export function paraRespostaPublica(c: ConviteBruto) {
  return {
    convidado: {
      primeiroNome: c.nome.trim().split(/\s+/)[0] ?? c.nome,
      statusRsvp: c.status_rsvp,
    },
    evento: {
      nome: c.eventos.nome_evento,
      tipo: c.eventos.tipo_evento ?? 'OUTRO',
      dataISO: c.eventos.data_evento.toISOString().slice(0, 10),
      local: c.eventos.local ?? undefined,
      cidade: c.eventos.cidade ?? undefined,
      imagemCapaUrl: c.eventos.imagem_capa_url ?? undefined,
    },
  };
}