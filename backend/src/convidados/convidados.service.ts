import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { EventosService } from '../eventos/eventos.service';
import { PrismaService } from '../prisma/prisma.service';
import { paraConvidadoResposta } from './convidados.mapper';
import { CriarConvidadoDto } from './dto/criar-convidado.dto';
import { EnviarConvitesDto } from './dto/enviar-convites.dto';
import { linkRsvpDoConvidado } from './link-rsvp';
import { violouUnicidade } from '../common/prisma-erros';

// Envia poucos e-mails por vez, para não abrir dezenas de conexões SMTP juntas.
const TAMANHO_LOTE_ENVIO = 5;

// o e-mail cumprimenta pelo primeiro nome,
// igual à prévia mostrada ao organizador.
function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome;
}

@Injectable()
export class ConvidadosService {
  private readonly logger = new Logger(ConvidadosService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventosService: EventosService,
    private readonly emailService: EmailService,
  ) {}

  async listar(usuarioId: string, eventoId: string) {
    await this.eventosService.garantirAcesso(eventoId, usuarioId);

    const convidados = await this.prisma.convidados.findMany({
      where: { evento_id: eventoId },
      orderBy: { criado_em: 'desc' },
    });

    return { convidados: convidados.map(paraConvidadoResposta) };
  }

  async criar(usuarioId: string, eventoId: string, dto: CriarConvidadoDto) {
    await this.eventosService.garantirAcesso(eventoId, usuarioId);

    try {
      const convidado = await this.prisma.convidados.create({
        data: {
          evento_id: eventoId,
          nome: dto.nome,
          email: dto.email ?? null,
          telefone: dto.telefone ?? null,
          grupo: dto.grupo ?? null,
        },
      });

      return { convidado: paraConvidadoResposta(convidado) };
    } catch (error) {
      if (violouUnicidade(error)) {
        throw new ConflictException(
          'Já existe um convidado com este e-mail neste evento.',
        );
      }
      throw error;
    }
  }

  async enviarConvites(
    usuarioId: string,
    eventoId: string,
    dto: EnviarConvitesDto,
  ) {
    await this.eventosService.garantirAcesso(eventoId, usuarioId);

    const idsUnicos = [...new Set(dto.convidadoIds)];
    const convidados = await this.prisma.convidados.findMany({
      where: { evento_id: eventoId, id: { in: idsUnicos } },
    });

    if (convidados.length !== idsUnicos.length) {
      throw new NotFoundException('Algum convidado não pertence a este evento.');
    }

    const comEmail = convidados.filter((c) => c.email);
    const semEmail = convidados.length - comEmail.length;
    const enviadosIds: string[] = [];

    for (let i = 0; i < comEmail.length; i += TAMANHO_LOTE_ENVIO) {
      const lote = comEmail.slice(i, i + TAMANHO_LOTE_ENVIO);

      const resultados = await Promise.allSettled(
        lote.map((c) =>
          this.emailService.enviarConvite(
            c.email ?? '',
            primeiroNome(c.nome),
            dto.assunto,
            dto.mensagem,
            linkRsvpDoConvidado(c.qr_code_token),
          ),
        ),
      );

      resultados.forEach((resultado, indice) => {
        if (resultado.status === 'fulfilled') {
          enviadosIds.push(lote[indice].id);
        } else {
          this.logger.warn(
            `Falha ao enviar convite (convidado ${lote[indice].id}): ${String(resultado.reason)}`,
          );
        }
      });
    }

    if (enviadosIds.length === 0) {
      return { enviados: 0, falhas: comEmail.length, semEmail, convidados: [] };
    }

    // Só marca como enviado quem realmente recebeu o envio com sucesso.
    const agora = new Date();
    await this.prisma.convidados.updateMany({
      where: { id: { in: enviadosIds } },
      data: { convite_enviado_em: agora, updated_at: agora },
    });

    const atualizados = await this.prisma.convidados.findMany({
      where: { id: { in: enviadosIds } },
    });

    return {
      enviados: enviadosIds.length,
      falhas: comEmail.length - enviadosIds.length,
      semEmail,
      convidados: atualizados.map(paraConvidadoResposta),
    };
  }
}