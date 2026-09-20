import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { perfil_usuario } from '../../generated/prisma/enums';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(150)
  nome: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @MaxLength(72, {
    message: 'A senha deve ter no máximo 72 caracteres.',
  })
  senha: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string;

  @IsOptional()
  @Matches(/^[0-9]{11}$/, {
    message: 'O CPF deve conter exatamente 11 dígitos numéricos, sem pontuação.',
  })
  cpf?: string;

  @IsOptional()
  @IsEnum(perfil_usuario, {
    message: 'Perfil inválido.',
  })
  perfil?: perfil_usuario;
}