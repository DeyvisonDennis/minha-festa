import type { convidados } from '../generated/prisma/client';
import { linkRsvpDoConvidado } from './link-rsvp';

export function paraConvidadoResposta(c: convidados) {
  return {
    id: c.id,
    nome: c.nome,
    email: c.email ?? '',
    telefone: c.telefone ?? '',
    grupo: c.grupo ?? '',
    conviteEnviadoEm: c.convite_enviado_em
      ? c.convite_enviado_em.toISOString()
      : null,
    statusRsvp: c.status_rsvp,
    // Link individual do convite, o mesmo que vai no e-mail. Só o organizador
    // do evento recebe isso, porque quem tem o link responde pelo convidado.
    linkRsvp: linkRsvpDoConvidado(c.qr_code_token),
  };
}