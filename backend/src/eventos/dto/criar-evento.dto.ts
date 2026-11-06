import { Transform } from 'class-transformer';
import { aparar } from '../../common/aparar';
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const TIPOS_EVENTO = [
  'CASAMENTO',
  'ANIVERSARIO',
  'CORPORATIVO',
  'FORMATURA',
  'DEBUTANTE',
  'OUTRO',
] as const;

export class CriarEventoDto {
  @IsIn(TIPOS_EVENTO, { message: 'Tipo de evento inválido.' })
  tipo: (typeof TIPOS_EVENTO)[number];

  @Transform(aparar)
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do evento.' })
  @MaxLength(180)
  nome: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'A data deve estar no formato AAAA-MM-DD.',
  })
  @IsISO8601({ strict: true }, { message: 'Data inválida.' })
  dataISO: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  convidadosEstimados?: number;

  @IsOptional()
  @Transform(aparar)
  @IsString()
  @MaxLength(255)
  local?: string;

  @IsOptional()
  @Transform(aparar)
  @IsString()
  @MaxLength(100)
  cidade?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999)
  orcamento?: number;

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