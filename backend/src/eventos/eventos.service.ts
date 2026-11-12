import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarEventoDto } from './dto/criar-evento.dto';
import { AtualizarEventoDto } from './dto/atualizar-evento.dto';
import { paraEventoResposta } from './eventos.mapper';

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}

  // Todos os eventos da conta, para o seletor da Sidebar (o mais próximo primeiro).
  async listar(usuarioId: string) {
    const eventos = await this.prisma.eventos.findMany({
      where: { organizador_id: usuarioId },
      orderBy: [{ data_evento: 'asc' }, { criado_em: 'asc' }],
    });

    return { eventos: eventos.map(paraEventoResposta) };
  }

  // O evento ativo é o escolhido no seletor (usuarios.evento_ativo_id). Se não
  // houver escolha, ou ela apontar para um evento que não existe mais, vale o
  // mais recente.
  async buscarAtivo(usuarioId: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { evento_ativo_id: true },
    });

    const escolhido = usuario?.evento_ativo_id
      ? await this.prisma.eventos.findFirst({
          where: { id: usuario.evento_ativo_id, organizador_id: usuarioId },
        })
      : null;

    const evento =
      escolhido ??
      (await this.prisma.eventos.findFirst({
        where: { organizador_id: usuarioId },
        orderBy: { criado_em: 'desc' },
      }));

    return { evento: evento ? paraEventoResposta(evento) : null };
  }

  async selecionarAtivo(usuarioId: string, eventoId: string) {
    const evento = await this.prisma.eventos.findFirst({
      where: { id: eventoId, organizador_id: usuarioId },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    await this.prisma.usuarios.update({
      where: { id: usuarioId },
      data: { evento_ativo_id: eventoId },
    });

    return { evento: paraEventoResposta(evento) };
  }

  // O evento recém-criado já passa a ser o ativo.
  async criar(usuarioId: string, dto: CriarEventoDto) {
    const evento = await this.prisma.$transaction(async (tx) => {
      const criado = await tx.eventos.create({
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

      await tx.usuarios.update({
        where: { id: usuarioId },
        data: { evento_ativo_id: criado.id },
      });

      return criado;
    });

    return { evento: paraEventoResposta(evento) };
  }

  async atualizar(usuarioId: string, eventoId: string, dto: AtualizarEventoDto) {
    await this.garantirAcesso(eventoId, usuarioId);

    const evento = await this.prisma.eventos.update({
      where: { id: eventoId },
      data: {
        nome_evento: dto.nome,
        tipo_evento: dto.tipo,
        data_evento: new Date(dto.dataISO),
        local: dto.local ?? null,
        cidade: dto.cidade ?? null,
        orcamento_total: dto.orcamento ?? 0,
        convidados_estimados: dto.convidadosEstimados ?? null,
        updated_at: new Date(),
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