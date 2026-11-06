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
import { AlterarStatusDto } from './dto/alterar-status.dto';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { ReordenarTarefasDto } from './dto/reordenar-tarefas.dto';
import { TarefasService } from './tarefas.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Get('eventos/:eventoId/tarefas')
  listar(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
  ) {
    return this.tarefasService.listar(usuario.id, eventoId);
  }

  @Post('eventos/:eventoId/tarefas')
  criar(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Body() dto: CriarTarefaDto,
  ) {
    return this.tarefasService.criar(usuario.id, eventoId, dto);
  }

  @Put('eventos/:eventoId/tarefas/ordem')
  reordenar(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Body() dto: ReordenarTarefasDto,
  ) {
    return this.tarefasService.reordenar(usuario.id, eventoId, dto.itens);
  }

  @Patch('tarefas/:id/status')
  alterarStatus(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AlterarStatusDto,
  ) {
    return this.tarefasService.alterarStatus(usuario.id, id, dto.status);
  }
}