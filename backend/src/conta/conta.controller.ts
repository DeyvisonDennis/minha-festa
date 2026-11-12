import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { UsuarioAutenticado } from '../auth/types/usuario-autenticado';
import { ContaService } from './conta.service';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';
import { AtualizarPerfilDto } from './dto/atualizar-perfil.dto';
import { ConfirmarTrocaEmailDto } from './dto/confirmar-troca-email.dto';
import { SolicitarTrocaEmailDto } from './dto/solicitar-troca-email.dto';

// O login é exigido rota a rota, porque a confirmação do e-mail é pública.
@Controller()
export class ContaController {
  constructor(private readonly contaService: ContaService) {}

  @Get('conta/perfil')
  @UseGuards(JwtAuthGuard)
  buscarPerfil(@CurrentUser() usuario: UsuarioAutenticado) {
    return this.contaService.buscarPerfil(usuario.id);
  }

  @Patch('conta/perfil')
  @UseGuards(JwtAuthGuard)
  atualizarPerfil(@CurrentUser() usuario: UsuarioAutenticado, @Body() dto: AtualizarPerfilDto) {
    return this.contaService.atualizarPerfil(usuario.id, dto);
  }

  @Post('conta/email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  solicitarTrocaEmail(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Body() dto: SolicitarTrocaEmailDto,
  ) {
    return this.contaService.solicitarTrocaEmail(usuario.id, dto);
  }

  @Delete('conta/email/pendente')
  @UseGuards(JwtAuthGuard)
  cancelarTrocaEmail(@CurrentUser() usuario: UsuarioAutenticado) {
    return this.contaService.cancelarTrocaEmail(usuario.id);
  }

  // Pública: o link do e-mail pode ser aberto em outro dispositivo, sem login.
  @Post('conta/email/confirmar')
  @HttpCode(200)
  confirmarTrocaEmail(@Body() dto: ConfirmarTrocaEmailDto) {
    return this.contaService.confirmarTrocaEmail(dto.token);
  }

  // Fica em /auth porque o cookie de refresh só é enviado para /auth/*,
  // e ele é necessário para manter a sessão atual ao encerrar as outras.
  @Patch('auth/senha')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  alterarSenha(
    @CurrentUser() usuario: UsuarioAutenticado,
    @Body() dto: AlterarSenhaDto,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies?.['refresh_token'] as string | undefined;
    return this.contaService.alterarSenha(usuario.id, dto, refreshToken);
  }
}