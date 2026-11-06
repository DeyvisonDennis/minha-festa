import type { eventos } from '../generated/prisma/client';

export function paraEventoResposta(e: eventos) {
  return {
    id: e.id,
    tipo: e.tipo_evento ?? 'OUTRO',
    nome: e.nome_evento,
    dataISO: e.data_evento.toISOString().slice(0, 10),
    local: e.local ?? undefined,
    cidade: e.cidade ?? undefined,
    orcamento: Number(e.orcamento_total),
    convidadosEstimados: e.convidados_estimados ?? undefined,
    imagemCapaUrl: e.imagem_capa_url,
  };
}