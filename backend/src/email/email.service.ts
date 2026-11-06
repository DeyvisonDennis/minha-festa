import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async enviarEmailRedefinicaoSenha(destinatario: string, nome: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: destinatario,
      subject: 'Redefinição de senha - Minha Festa',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Olá, ${escaparHtml(nome)}!</h2>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta na Minha Festa.</p>
          <p>Clique no botão abaixo para criar uma nova senha. Este link é válido por 1 hora.</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${link}" style="background-color: #8b6f47; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Redefinir senha
            </a>
          </p>
          <p>Se você não solicitou essa alteração, pode ignorar este e-mail com segurança.</p>
        </div>
      `,
    });
  }

    async enviarConvite(
    destinatario: string,
    nome: string,
    assunto: string,
    mensagemTemplate: string,
    linkRsvp: string,
  ) {
    // Substitui as variáveis do modelo. Usa funções em vez de texto direto para
    // que caracteres como "$&" no nome do convidado não sejam interpretados.
    const mensagemPersonalizada = mensagemTemplate
      .replace(/\{nome\}/g, () => nome)
      .replace(/\{link_rsvp\}/g, () => linkRsvp);

    // Nome e mensagem vêm do usuário, então o HTML é escapado primeiro e só
    // depois o link do RSVP é transformado em link clicável.
    const linkSeguro = escaparHtml(linkRsvp);
    const htmlMensagem = escaparHtml(mensagemPersonalizada)
      .split(linkSeguro)
      .join(`<a href="${linkSeguro}">${linkSeguro}</a>`)
      .replace(/\n/g, '<br>');

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: destinatario,
      subject: assunto,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; line-height: 1.6;">
          ${htmlMensagem}
        </div>
      `,
    });
  }
}

