import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { UsuarioAutenticado } from '../auth/types/usuario-autenticado';
import { AtualizarCapaDto } from './dto/atualizar-capa.dto';
import { CriarEventoDto } from './dto/criar-evento.dto';
import { EventosService } from './eventos.service';

@Controller('eventos')
@UseGuards(JwtAuthGuard)
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Get('ativo')
  buscarAtivo(@CurrentUser() usuario: UsuarioAutenticado) {
    return this.eventosService.buscarAtivo(usuario.id);
  }

  @Post()
  criar(@CurrentUser() usuario: UsuarioAutenticado, @Body() dto: CriarEventoDto) {
    return this.eventosService.criar(usuario.id, dto);
  }

  @Patch(':id/capa')
  atualizarCapa(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarCapaDto,
  ) {
    return this.eventosService.atualizarCapa(usuario.id, id, dto.imagemCapaUrl);
  }
}