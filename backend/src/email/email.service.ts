import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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
          <h2>Olá, ${nome}!</h2>
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
}