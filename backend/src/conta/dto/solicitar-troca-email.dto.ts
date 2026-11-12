import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SolicitarTrocaEmailDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'E-mail inválido.' })
  @MaxLength(150)
  novoEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Informe a senha atual.' })
  @MaxLength(72)
  senhaAtual: string;
}