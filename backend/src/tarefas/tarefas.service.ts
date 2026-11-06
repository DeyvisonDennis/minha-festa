import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventosService } from '../eventos/eventos.service';
import type { status_tarefa } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import type { ItemOrdemDto } from './dto/reordenar-tarefas.dto';
import { PRIORIDADE_PARA_NUMERO, paraTarefaResposta } from './tarefas.mapper';

// Mantém "concluida_em" coerente com o status: preenche ao concluir,
// limpa ao reabrir e não mexe se a tarefa já estava concluída.
function dadosDeConclusao(statusAtual: status_tarefa, novoStatus: status_tarefa) {
  if (novoStatus === 'CONCLUIDA') {
    return statusAtual === 'CONCLUIDA' ? {} : { concluida_em: new Date() };
  }
  return { concluida_em: null };
}

@Injectable()
export class TarefasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventosService: EventosService,
  ) {}

  async listar(usuarioId: string, eventoId: string) {
    await this.eventosService.garantirAcesso(eventoId, usuarioId);

    const tarefas = await this.prisma.tarefas.findMany({
      where: { evento_id: eventoId },
      orderBy: [{ ordem: 'asc' }, { criado_em: 'desc' }],
    });

    return { tarefas: tarefas.map(paraTarefaResposta) };
  }

  async criar(usuarioId: string, eventoId: string, dto: CriarTarefaDto) {
    await this.eventosService.garantirAcesso(eventoId, usuarioId);

    // A tarefa nova entra no topo: ordem menor que a de todas as existentes.
    const { _min } = await this.prisma.tarefas.aggregate({
      where: { evento_id: eventoId },
      _min: { ordem: true },
    });

    const tarefa = await this.prisma.tarefas.create({
      data: {
        evento_id: eventoId,
        titulo: dto.titulo,
        descricao: dto.descricao || null,
        categoria: dto.categoria,
        prazo: new Date(dto.prazoISO),
        prioridade: PRIORIDADE_PARA_NUMERO[dto.prioridade],
        ordem: _min.ordem === null ? 0 : _min.ordem - 1,
      },
    });

    return { tarefa: paraTarefaResposta(tarefa) };
  }

  async alterarStatus(usuarioId: string, tarefaId: string, status: status_tarefa) {
    // O filtro pela relação garante que a tarefa é de um evento do usuário.
    const atual = await this.prisma.tarefas.findFirst({
      where: { id: tarefaId, eventos: { organizador_id: usuarioId } },
    });

    if (!atual) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const tarefa = await this.prisma.tarefas.update({
      where: { id: tarefaId },
      data: {
        status,
        ...dadosDeConclusao(atual.status, status),
        updated_at: new Date(),
      },
    });

    return { tarefa: paraTarefaResposta(tarefa) };
  }

  async reordenar(usuarioId: string, eventoId: string, itens: ItemOrdemDto[]) {
    await this.eventosService.garantirAcesso(eventoId, usuarioId);

    const ids = itens.map((item) => item.id);
    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException('A lista contém tarefas repetidas.');
    }

    const existentes = await this.prisma.tarefas.findMany({
      where: { evento_id: eventoId, id: { in: ids } },
      select: { id: true, status: true, ordem: true },
    });

    if (existentes.length !== ids.length) {
      throw new NotFoundException('Alguma tarefa não pertence a este evento.');
    }

    const porId = new Map(existentes.map((t) => [t.id, t]));
    const agora = new Date();

    // Só grava o que realmente mudou, tudo numa única transação.
    const operacoes = itens.flatMap((item, indice) => {
      const atual = porId.get(item.id);
      if (!atual) return [];
      if (atual.ordem === indice && atual.status === item.status) return [];

      return [
        this.prisma.tarefas.update({
          where: { id: item.id },
          data: {
            ordem: indice,
            status: item.status,
            ...dadosDeConclusao(atual.status, item.status),
            updated_at: agora,
          },
        }),
      ];
    });

    if (operacoes.length > 0) {
      await this.prisma.$transaction(operacoes);
    }

    return { atualizadas: operacoes.length };
  }
}