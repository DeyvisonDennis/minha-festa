import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { aparar, apararOuUndefined } from '../../common/aparar';

export class CriarConvidadoDto {
  @Transform(aparar)
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do convidado.' })
  @MaxLength(150)
  nome: string;

  @IsOptional()
  @Transform(apararOuUndefined)
  @IsEmail({}, { message: 'E-mail inválido.' })
  @MaxLength(254)
  email?: string;

  @IsOptional()
  @Transform(apararOuUndefined)
  @IsString()
  @MaxLength(20)
  telefone?: string;

  @IsOptional()
  @Transform(apararOuUndefined)
  @IsString()
  @MaxLength(100)
  grupo?: string;
}