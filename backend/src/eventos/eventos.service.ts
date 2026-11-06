import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarEventoDto } from './dto/criar-evento.dto';
import { paraEventoResposta } from './eventos.mapper';

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}

  // O banco aceita vários eventos por organizador, mas a interface trabalha
  // com um "evento ativo" por enquanto: o mais recente.
  async buscarAtivo(usuarioId: string) {
    const evento = await this.prisma.eventos.findFirst({
      where: { organizador_id: usuarioId },
      orderBy: { criado_em: 'desc' },
    });

    return { evento: evento ? paraEventoResposta(evento) : null };
  }

  async criar(usuarioId: string, dto: CriarEventoDto) {
    const evento = await this.prisma.eventos.create({
      data: {
        organizador_id: usuarioId,
        nome_evento: dto.nome,
        tipo_evento: dto.tipo,
        data_evento: new Date(dto.dataISO),
        local: dto.local || undefined,
        cidade: dto.cidade || undefined,
        orcamento_total: dto.orcamento ?? 0,
        convidados_estimados: dto.convidadosEstimados,
        imagem_capa_url: dto.imagemCapaUrl,
      },
    });

    return { evento: paraEventoResposta(evento) };
  }

  async atualizarCapa(usuarioId: string, eventoId: string, imagemCapaUrl: string) {
    await this.garantirAcesso(eventoId, usuarioId);

    const evento = await this.prisma.eventos.update({
      where: { id: eventoId },
      data: { imagem_capa_url: imagemCapaUrl, updated_at: new Date() },
    });

    return { evento: paraEventoResposta(evento) };
  }

  // Reutilizado pelos módulos de Tarefas e Convidados: confirma que o evento
  // pertence ao usuário logado. Devolve 404 (e não 403) de propósito, para não
  // revelar se um ID de evento de outra pessoa existe.
  async garantirAcesso(eventoId: string, usuarioId: string): Promise<void> {
    const evento = await this.prisma.eventos.findFirst({
      where: { id: eventoId, organizador_id: usuarioId },
      select: { id: true },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }
  }
}