import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { aparar, apararOuUndefined } from '../../common/aparar';

export class AtualizarPerfilDto {
  @Transform(aparar)
  @IsString()
  @IsNotEmpty({ message: 'Informe seu nome.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(150)
  nome: string;

  // Vazio remove o telefone. Aceita a máscara do frontend: (11) 99999-0000.
  @IsOptional()
  @Transform(apararOuUndefined)
  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, { message: 'Telefone inválido.' })
  @MaxLength(20)
  telefone?: string;
}