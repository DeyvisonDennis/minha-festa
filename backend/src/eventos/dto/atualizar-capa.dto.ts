import { IsUrl, MaxLength } from 'class-validator';

export class AtualizarCapaDto {
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
      host_whitelist: ['images.unsplash.com'],
    },
    { message: 'Imagem de capa inválida.' },
  )
  @MaxLength(500)
  imagemCapaUrl: string;
}