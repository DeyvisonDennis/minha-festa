import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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