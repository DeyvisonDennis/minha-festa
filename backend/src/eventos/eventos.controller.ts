import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { UsuarioAutenticado } from '../auth/types/usuario-autenticado';
import { AtualizarCapaDto } from './dto/atualizar-capa.dto';
import { AtualizarEventoDto } from './dto/atualizar-evento.dto';
import { CriarEventoDto } from './dto/criar-evento.dto';
import { SelecionarEventoDto } from './dto/selecionar-evento.dto';
import { EventosService } from './eventos.service';

@Controller('eventos')
@UseGuards(JwtAuthGuard)
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Get()
  listar(@CurrentUser() usuario: UsuarioAutenticado) {
    return this.eventosService.listar(usuario.id);
  }

  @Get('ativo')
  buscarAtivo(@CurrentUser() usuario: UsuarioAutenticado) {
    return this.eventosService.buscarAtivo(usuario.id);
  }

  // Precisa vir ANTES de @Put(':id'): na ordem inversa, "ativo" seria lido como id.
  @Put('ativo')
  selecionarAtivo(@CurrentUser() usuario: UsuarioAutenticado, @Body() dto: SelecionarEventoDto) {
    return this.eventosService.selecionarAtivo(usuario.id, dto.eventoId);
  }

  @Post()
  criar(@CurrentUser() usuario: UsuarioAutenticado, @Body() dto: CriarEventoDto) {
    return this.eventosService.criar(usuario.id, dto);
  }

  @Put(':id')
  atualizar(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarEventoDto,
  ) {
    return this.eventosService.atualizar(usuario.id, id, dto);
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