import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ResponderRsvpDto } from './dto/responder-rsvp.dto';
import { RsvpService } from './rsvp.service';

// Rotas públicas: quem abre o link do convite não precisa estar logado.
@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Get(':token')
  abrir(@Param('token', ParseUUIDPipe) token: string) {
    return this.rsvpService.abrir(token);
  }

  @Post(':token')
  @HttpCode(200)
  responder(
    @Param('token', ParseUUIDPipe) token: string,
    @Body() dto: ResponderRsvpDto,
  ) {
    return this.rsvpService.responder(token, dto.resposta);
  }
}