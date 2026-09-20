import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const senha_hash = await bcrypt.hash(dto.senha, 10);

    try {
      const usuario = await this.prisma.usuarios.create({
        data: {
          nome: dto.nome,
          email: dto.email,
          senha_hash,
          telefone: dto.telefone,
          cpf: dto.cpf,
          perfil: dto.perfil,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          perfil: true,
          criado_em: true,
        },
      });

      return usuario;
    } catch (error: any) {
      if (error.code === 'P2002') {
        const campo = error.meta?.target?.[0] ?? 'campo';
        throw new ConflictException(`Já existe um usuário com esse ${campo}.`);
      }
      throw error;
    }
  }

  async login(dto: LoginDto, ipOrigem?: string, userAgent?: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { email: dto.email },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senha_hash);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    await this.prisma.usuarios.update({
      where: { id: usuario.id },
      data: { ultimo_login: new Date() },
    });

    const accessToken = this.gerarAccessToken(usuario.id, usuario.perfil);
    const refreshToken = await this.criarSessao(
      usuario.id,
      ipOrigem,
      userAgent,
    );

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }

    async refresh(refreshTokenRaw: string | undefined, ipOrigem?: string, userAgent?: string) {
    if (!refreshTokenRaw) {
      throw new UnauthorizedException('Refresh token ausente.');
    }

    const refresh_token_hash = this.hashRefreshToken(refreshTokenRaw);

    const sessao = await this.prisma.sessoes_usuario.findUnique({
      where: { refresh_token_hash },
    });

    if (!sessao) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    if (sessao.revogada_em) {
      await this.prisma.sessoes_usuario.updateMany({
        where: { usuario_id: sessao.usuario_id, revogada_em: null },
        data: { revogada_em: new Date() },
      });
      throw new UnauthorizedException(
        'Sessão inválida. Faça login novamente.',
      );
    }

    if (sessao.expira_em < new Date()) {
      throw new UnauthorizedException('Sessão expirada. Faça login novamente.');
    }

    await this.prisma.sessoes_usuario.update({
      where: { id: sessao.id },
      data: { revogada_em: new Date() },
    });

    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: sessao.usuario_id },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Usuário inválido.');
    }

    const accessToken = this.gerarAccessToken(usuario.id, usuario.perfil);
    const refreshToken = await this.criarSessao(
      usuario.id,
      ipOrigem,
      userAgent,
    );

    return { accessToken, refreshToken };
  }

    async logout(refreshTokenRaw: string | undefined) {
    if (!refreshTokenRaw) {
      return;
    }

    const refresh_token_hash = this.hashRefreshToken(refreshTokenRaw);

    await this.prisma.sessoes_usuario.updateMany({
      where: { refresh_token_hash, revogada_em: null },
      data: { revogada_em: new Date() },
    });
  }

    async forgotPassword(dto: ForgotPasswordDto) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { email: dto.email },
    });

    if (usuario && usuario.ativo) {
      const tokenBruto = crypto.randomBytes(32).toString('hex');
      const token_hash = crypto
        .createHmac('sha256', process.env.PASSWORD_RESET_SECRET!)
        .update(tokenBruto)
        .digest('hex');

      const expiraEm = new Date();
      expiraEm.setHours(expiraEm.getHours() + 1);

      await this.prisma.tokens_recuperacao_senha.create({
        data: {
          usuario_id: usuario.id,
          token_hash,
          expira_em: expiraEm,
        },
      });

      const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${tokenBruto}`;

      await this.emailService.enviarEmailRedefinicaoSenha(
        usuario.email,
        usuario.nome,
        link,
      );
    }

    return {
      message:
        'Se o e-mail informado estiver cadastrado, você receberá um link de redefinição em instantes.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const token_hash = crypto
      .createHmac('sha256', process.env.PASSWORD_RESET_SECRET!)
      .update(dto.token)
      .digest('hex');

    const registro = await this.prisma.tokens_recuperacao_senha.findUnique({
      where: { token_hash },
    });

    if (
      !registro ||
      registro.utilizado_em ||
      registro.expira_em < new Date()
    ) {
      throw new UnauthorizedException('Link de redefinição inválido ou expirado.');
    }

    const senha_hash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.$transaction([
      this.prisma.usuarios.update({
        where: { id: registro.usuario_id },
        data: { senha_hash },
      }),
      this.prisma.tokens_recuperacao_senha.update({
        where: { id: registro.id },
        data: { utilizado_em: new Date() },
      }),
      this.prisma.sessoes_usuario.updateMany({
        where: { usuario_id: registro.usuario_id, revogada_em: null },
        data: { revogada_em: new Date() },
      }),
    ]);

    return { message: 'Senha redefinida com sucesso.' };
  }

  private gerarAccessToken(usuarioId: string, perfil: string): string {
    return this.jwtService.sign({ sub: usuarioId, perfil });
  }

  private hashRefreshToken(token: string): string {
    return crypto
      .createHmac('sha256', process.env.JWT_REFRESH_SECRET!)
      .update(token)
      .digest('hex');
  }

  private async criarSessao(
    usuarioId: string,
    ipOrigem?: string,
    userAgent?: string,
  ): Promise<string> {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refresh_token_hash = this.hashRefreshToken(refreshToken);

    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7);

    await this.prisma.sessoes_usuario.create({
      data: {
        usuario_id: usuarioId,
        refresh_token_hash,
        ip_origem: ipOrigem,
        user_agent: userAgent,
        expira_em: expiraEm,
      },
    });

    return refreshToken;
  }
}