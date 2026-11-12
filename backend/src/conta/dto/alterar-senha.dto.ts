import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AlterarSenhaDto {
  // Opcional só para contas que ainda não têm senha (o serviço confere).
  @IsOptional()
  @IsString()
  @MaxLength(72)
  senhaAtual?: string;

  @IsString()
  @MinLength(8, { message: 'A nova senha deve ter pelo menos 8 caracteres.' })
  @MaxLength(72, { message: 'A nova senha deve ter no máximo 72 caracteres.' })
  novaSenha: string;
}