import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RespostaRsvp } from './dto/responder-rsvp.dto';
import { paraRespostaPublica, SELECAO_CONVITE } from './rsvp.mapper';

@Injectable()
export class RsvpService {
  constructor(private readonly prisma: PrismaService) {}

  async abrir(token: string) {
    const convite = await this.buscarConvite(token);
    return paraRespostaPublica(convite);
  }

  async responder(token: string, resposta: RespostaRsvp) {
    const convite = await this.buscarConvite(token);
    const agora = new Date();

    const atualizado = await this.prisma.convidados.update({
      where: { id: convite.id },
      data: { status_rsvp: resposta, respondeu_em: agora, updated_at: agora },
      select: SELECAO_CONVITE,
    });

    return paraRespostaPublica(atualizado);
  }

  // O token é a "senha" do convidado. Se não existir, a resposta é a mesma
  // para qualquer valor: não há como descobrir quais tokens são válidos.
  private async buscarConvite(token: string) {
    const convite = await this.prisma.convidados.findUnique({
      where: { qr_code_token: token },
      select: SELECAO_CONVITE,
    });

    if (!convite) {
      throw new NotFoundException('Convite não encontrado.');
    }

    return convite;
  }
}