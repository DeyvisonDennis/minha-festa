import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { UsuarioAutenticado } from '../auth/types/usuario-autenticado';
import { ConvidadosService } from './convidados.service';
import { CriarConvidadoDto } from './dto/criar-convidado.dto';
import { EnviarConvitesDto } from './dto/enviar-convites.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ConvidadosController {
  constructor(private readonly convidadosService: ConvidadosService) {}

  @Get('eventos/:eventoId/convidados')
  listar(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
  ) {
    return this.convidadosService.listar(usuario.id, eventoId);
  }

  @Post('eventos/:eventoId/convidados')
  criar(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Body() dto: CriarConvidadoDto,
  ) {
    return this.convidadosService.criar(usuario.id, eventoId, dto);
  }

  @Post('eventos/:eventoId/convidados/enviar-convites')
  enviarConvites(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Body() dto: EnviarConvitesDto,
  ) {
    return this.convidadosService.enviarConvites(usuario.id, eventoId, dto);
  }
}