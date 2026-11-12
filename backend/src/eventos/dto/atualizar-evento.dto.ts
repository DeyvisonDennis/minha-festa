import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { aparar, apararOuUndefined } from '../../common/aparar';
import { TIPOS_EVENTO } from './criar-evento.dto';

// Edição completa do evento (tela de Configurações). Campos opcionais que
// chegam vazios são apagados no banco; a capa continua em /eventos/:id/capa.
export class AtualizarEventoDto {
  @IsIn(TIPOS_EVENTO, { message: 'Tipo de evento inválido.' })
  tipo: (typeof TIPOS_EVENTO)[number];

  @Transform(aparar)
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do evento.' })
  @MaxLength(180)
  nome: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'A data deve estar no formato AAAA-MM-DD.' })
  @IsISO8601({ strict: true }, { message: 'Data inválida.' })
  dataISO: string;

  @IsOptional()
  @IsInt({ message: 'Número de convidados inválido.' })
  @Min(0)
  @Max(100000)
  convidadosEstimados?: number;

  @IsOptional()
  @Transform(apararOuUndefined)
  @IsString()
  @MaxLength(255)
  local?: string;

  @IsOptional()
  @Transform(apararOuUndefined)
  @IsString()
  @MaxLength(100)
  cidade?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Orçamento inválido.' })
  @Min(0)
  @Max(9999999999)
  orcamento?: number;
}