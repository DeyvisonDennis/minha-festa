// Link individual de RSVP: cada convidado tem o seu, gerado a partir do token
// único dele (coluna qr_code_token). Só quem tem o link consegue responder.
export function linkRsvpDoConvidado(token: string): string {
  const base = (process.env.FRONTEND_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
  return `${base}/rsvp/${token}`;
}