import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { violouUnicidade } from '../common/prisma-erros';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';
import { AtualizarPerfilDto } from './dto/atualizar-perfil.dto';
import { SolicitarTrocaEmailDto } from './dto/solicitar-troca-email.dto';

const SELECAO_PERFIL = {
  id: true,
  nome: true,
  email: true,
  telefone: true,
  perfil: true,
  ativo: true,
  senha_hash: true,
  google_id: true,
} as const;

type PerfilBruto = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  perfil: string;
  ativo: boolean;
  senha_hash: string | null;
  google_id: string | null;
};

// Validade do link de confirmação e intervalo mínimo entre pedidos.
const VALIDADE_TROCA_EMAIL_MS = 60 * 60 * 1000; // 1 hora
const INTERVALO_ENTRE_PEDIDOS_MS = 60 * 1000; // 1 minuto

// Nunca devolve o hash da senha: só se ela existe.
function paraPerfilResposta(u: PerfilBruto, emailPendente: string | null) {
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    telefone: u.telefone ?? '',
    perfil: u.perfil,
    ativo: u.ativo,
    temSenha: u.senha_hash !== null,
    loginGoogle: u.google_id !== null,
    emailPendente,
  };
}

// Mesmo cálculo do AuthService (HMAC com JWT_REFRESH_SECRET), para achar a
// sessão atual pelo cookie de refresh.
function hashRefreshToken(token: string): string {
  return crypto
    .createHmac('sha256', process.env.JWT_REFRESH_SECRET!)
    .update(token)
    .digest('hex');
}

// O prefixo separa estes tokens dos de redefinição de senha, que usam o mesmo segredo.
function hashTokenTrocaEmail(token: string): string {
  return crypto
    .createHmac('sha256', process.env.PASSWORD_RESET_SECRET!)
    .update(`troca-email:${token}`)
    .digest('hex');
}

// "ana.souza@gmail.com" -> "a*********@gmail.com", para o aviso ao e-mail antigo.
function mascararEmail(email: string): string {
  const [local, dominio] = email.split('@');
  return `${local.slice(0, 1)}${'*'.repeat(Math.max(local.length - 1, 3))}@${dominio}`;
}

@Injectable()
export class ContaService {
  private readonly logger = new Logger(ContaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async buscarPerfil(usuarioId: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: SELECAO_PERFIL,
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return { perfil: paraPerfilResposta(usuario, await this.emailPendente(usuarioId)) };
  }

  async atualizarPerfil(usuarioId: string, dto: AtualizarPerfilDto) {
    const usuario = await this.prisma.usuarios.update({
      where: { id: usuarioId },
      data: {
        nome: dto.nome,
        telefone: dto.telefone ?? null,
        updated_at: new Date(),
      },
      select: SELECAO_PERFIL,
    });

    return { perfil: paraPerfilResposta(usuario, await this.emailPendente(usuarioId)) };
  }

  // Troca a senha e encerra as outras sessões (outros dispositivos). A sessão
  // atual continua ativa, para a pessoa não ser deslogada ao salvar.
  async alterarSenha(usuarioId: string, dto: AlterarSenhaDto, refreshTokenAtual?: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { senha_hash: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (usuario.senha_hash) {
      if (!dto.senhaAtual) {
        throw new BadRequestException('Informe a senha atual.');
      }
      // 400 (e não 401): um 401 faria o frontend tentar renovar a sessão.
      const confere = await bcrypt.compare(dto.senhaAtual, usuario.senha_hash);
      if (!confere) {
        throw new BadRequestException('A senha atual está incorreta.');
      }
      if (await bcrypt.compare(dto.novaSenha, usuario.senha_hash)) {
        throw new BadRequestException('A nova senha deve ser diferente da atual.');
      }
    }

    const senha_hash = await bcrypt.hash(dto.novaSenha, 10);
    const agora = new Date();
    const hashAtual = refreshTokenAtual ? hashRefreshToken(refreshTokenAtual) : undefined;

    const [, revogadas] = await this.prisma.$transaction([
      this.prisma.usuarios.update({
        where: { id: usuarioId },
        data: { senha_hash, updated_at: agora },
      }),
      this.prisma.sessoes_usuario.updateMany({
        where: {
          usuario_id: usuarioId,
          revogada_em: null,
          ...(hashAtual ? { refresh_token_hash: { not: hashAtual } } : {}),
        },
        data: { revogada_em: agora },
      }),
    ]);

    return { message: 'Senha alterada com sucesso.', sessoesEncerradas: revogadas.count };
  }

  // Passo 1 da troca de e-mail: confere a senha, guarda o pedido e manda o link
  // para o e-mail NOVO. O e-mail da conta só muda quando o link for confirmado.
  async solicitarTrocaEmail(usuarioId: string, dto: SolicitarTrocaEmailDto) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { nome: true, email: true, senha_hash: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    if (!usuario.senha_hash) {
      throw new BadRequestException('Crie uma senha antes de trocar o e-mail.');
    }
    if (!(await bcrypt.compare(dto.senhaAtual, usuario.senha_hash))) {
      throw new BadRequestException('A senha atual está incorreta.');
    }
    if (dto.novoEmail === usuario.email.toLowerCase()) {
      throw new BadRequestException('Esse já é o e-mail da sua conta.');
    }

    const emUso = await this.prisma.usuarios.findUnique({
      where: { email: dto.novoEmail },
      select: { id: true },
    });
    if (emUso) {
      throw new ConflictException('Este e-mail já está em uso por outra conta.');
    }

    // Evita disparar vários e-mails seguidos.
    const pedidoRecente = await this.prisma.tokens_confirmacao_email.findFirst({
      where: {
        usuario_id: usuarioId,
        novo_email: { not: null },
        utilizado_em: null,
        criado_em: { gt: new Date(Date.now() - INTERVALO_ENTRE_PEDIDOS_MS) },
      },
      select: { id: true },
    });
    if (pedidoRecente) {
      throw new HttpException(
        'Aguarde um minuto antes de pedir outra troca de e-mail.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Só vale o pedido mais recente: os anteriores ainda pendentes são descartados.
    await this.prisma.tokens_confirmacao_email.deleteMany({
      where: { usuario_id: usuarioId, novo_email: { not: null }, utilizado_em: null },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const registro = await this.prisma.tokens_confirmacao_email.create({
      data: {
        usuario_id: usuarioId,
        token_hash: hashTokenTrocaEmail(token),
        novo_email: dto.novoEmail,
        expira_em: new Date(Date.now() + VALIDADE_TROCA_EMAIL_MS),
      },
      select: { id: true },
    });

    const link = `${process.env.FRONTEND_URL}/confirmar-email?token=${token}`;

    try {
      await this.emailService.enviarConfirmacaoTrocaEmail(dto.novoEmail, usuario.nome, link);
    } catch (error) {
      // Sem o e-mail de confirmação o pedido não serve para nada: desfaz.
      await this.prisma.tokens_confirmacao_email.delete({ where: { id: registro.id } });
      this.logger.error(`Falha ao enviar a confirmação de troca de e-mail: ${String(error)}`);
      throw new ServiceUnavailableException(
        'Não foi possível enviar o e-mail de confirmação. Tente novamente mais tarde.',
      );
    }

    // Avisa o e-mail atual. Se falhar, o pedido continua valendo.
    try {
      await this.emailService.enviarAvisoTrocaEmail(
        usuario.email,
        usuario.nome,
        mascararEmail(dto.novoEmail),
        'solicitada',
      );
    } catch (error) {
      this.logger.warn(`Falha ao avisar o e-mail atual sobre a troca: ${String(error)}`);
    }

    return {
      message: `Enviamos um link de confirmação para ${dto.novoEmail}.`,
      emailPendente: dto.novoEmail,
    };
  }

  async cancelarTrocaEmail(usuarioId: string) {
    await this.prisma.tokens_confirmacao_email.deleteMany({
      where: { usuario_id: usuarioId, novo_email: { not: null }, utilizado_em: null },
    });

    return { message: 'Pedido de troca de e-mail cancelado.' };
  }

  // Passo 2: o link do e-mail. Rota pública (quem tem o link pode estar em outro
  // dispositivo). Troca o e-mail e encerra TODAS as sessões da conta.
  async confirmarTrocaEmail(token: string) {
    const registro = await this.prisma.tokens_confirmacao_email.findUnique({
      where: { token_hash: hashTokenTrocaEmail(token) },
      select: {
        id: true,
        usuario_id: true,
        novo_email: true,
        expira_em: true,
        utilizado_em: true,
        usuarios: { select: { nome: true, email: true } },
      },
    });

    if (
      !registro ||
      !registro.novo_email ||
      registro.utilizado_em ||
      registro.expira_em < new Date()
    ) {
      throw new BadRequestException('Link de confirmação inválido ou expirado.');
    }

    const novoEmail = registro.novo_email;
    const emailAntigo = registro.usuarios.email;
    const agora = new Date();

    try {
      await this.prisma.$transaction([
        this.prisma.usuarios.update({
          where: { id: registro.usuario_id },
          data: { email: novoEmail, email_confirmado: true, updated_at: agora },
        }),
        this.prisma.tokens_confirmacao_email.update({
          where: { id: registro.id },
          data: { utilizado_em: agora },
        }),
        this.prisma.sessoes_usuario.updateMany({
          where: { usuario_id: registro.usuario_id, revogada_em: null },
          data: { revogada_em: agora },
        }),
      ]);
    } catch (error) {
      // Alguém cadastrou esse e-mail entre o pedido e a confirmação.
      if (violouUnicidade(error)) {
        throw new ConflictException('Este e-mail passou a ser usado por outra conta.');
      }
      throw error;
    }

    try {
      await this.emailService.enviarAvisoTrocaEmail(
        emailAntigo,
        registro.usuarios.nome,
        mascararEmail(novoEmail),
        'concluida',
      );
    } catch (error) {
      this.logger.warn(`Falha ao avisar o e-mail antigo sobre a troca: ${String(error)}`);
    }

    return { message: 'E-mail alterado com sucesso.', email: novoEmail };
  }

  private async emailPendente(usuarioId: string): Promise<string | null> {
    const pedido = await this.prisma.tokens_confirmacao_email.findFirst({
      where: {
        usuario_id: usuarioId,
        novo_email: { not: null },
        utilizado_em: null,
        expira_em: { gt: new Date() },
      },
      orderBy: { criado_em: 'desc' },
      select: { novo_email: true },
    });

    return pedido?.novo_email ?? null;
  }
}