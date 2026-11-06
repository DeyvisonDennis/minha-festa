import { IsIn } from 'class-validator';

// O convidado só pode confirmar ou recusar. Voltar para "pendente" não existe.
export const RESPOSTAS_RSVP = ['CONFIRMADO', 'NAO_CONFIRMADO'] as const;
export type RespostaRsvp = (typeof RESPOSTAS_RSVP)[number];

export class ResponderRsvpDto {
  @IsIn(RESPOSTAS_RSVP, { message: 'Resposta inválida.' })
  resposta: RespostaRsvp;
}