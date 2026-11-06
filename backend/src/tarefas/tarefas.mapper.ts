import type { tarefas } from '../generated/prisma/client';
import type { PrioridadeTarefa } from './dto/criar-tarefa.dto';

export const PRIORIDADE_PARA_NUMERO: Record<PrioridadeTarefa, number> = {
  BAIXA: 0,
  MEDIA: 1,
  ALTA: 2,
};

function numeroParaPrioridade(valor: number): PrioridadeTarefa {
  if (valor >= 2) return 'ALTA';
  if (valor === 1) return 'MEDIA';
  return 'BAIXA';
}

export function paraTarefaResposta(t: tarefas) {
  return {
    id: t.id,
    titulo: t.titulo,
    descricao: t.descricao ?? '',
    categoria: t.categoria ?? 'Geral',
    prazoISO: t.prazo ? t.prazo.toISOString().slice(0, 10) : '',
    status: t.status,
    prioridade: numeroParaPrioridade(t.prioridade),
  };
}