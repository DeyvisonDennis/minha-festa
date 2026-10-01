import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailService } from '../email/email.service';
import { EnviarConvitesDto } from './dto/enviar-convites.dto';

@Controller('convidados')
export class ConvidadosController {
  constructor(private readonly emailService: EmailService) {}

  @Post('enviar-convites')
  @UseGuards(JwtAuthGuard)
  async enviarConvites(@Body() dto: EnviarConvitesDto) {
    const resultados = await Promise.allSettled(
      dto.destinatarios.map((destinatario) =>
        this.emailService.enviarConvite(
          destinatario.email,
          destinatario.nome,
          dto.assunto,
          dto.mensagem,
          dto.linkRsvp,
        ),
      ),
    );

    const enviados = resultados.filter((r) => r.status === 'fulfilled').length;
    const falhas = resultados.length - enviados;

    return { enviados, falhas, total: dto.destinatarios.length };
  }
}