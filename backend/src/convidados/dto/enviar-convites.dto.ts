import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

class DestinatarioDto {
  @IsString()
  @MinLength(1)
  nome: string;

  @IsEmail({}, { message: 'E-mail inválido para um dos destinatários.' })
  email: string;
}

export class EnviarConvitesDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Selecione pelo menos um destinatário.' })
  @ValidateNested({ each: true })
  @Type(() => DestinatarioDto)
  destinatarios: DestinatarioDto[];

  @IsString()
  @MinLength(1)
  assunto: string;

  @IsString()
  @MinLength(1)
  mensagem: string;

  @IsString()
  linkRsvp: string;
}