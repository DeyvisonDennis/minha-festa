import { IsString, Matches } from 'class-validator';

export class ConfirmarTrocaEmailDto {
  @IsString()
  @Matches(/^[0-9a-f]{64}$/, { message: 'Link de confirmação inválido.' })
  token: string;
}