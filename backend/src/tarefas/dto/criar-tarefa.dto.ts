import { Transform } from 'class-transformer';
import {
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { aparar } from '../../common/aparar';

export const PRIORIDADES = ['ALTA', 'MEDIA', 'BAIXA'] as const;
export type PrioridadeTarefa = (typeof PRIORIDADES)[number];

export class CriarTarefaDto {
  @Transform(aparar)
  @IsString()
  @IsNotEmpty({ message: 'Informe o título da tarefa.' })
  @MaxLength(180)
  titulo: string;

  @IsOptional()
  @Transform(aparar)
  @IsString()
  @MaxLength(1000)
  descricao?: string;

  @Transform(aparar)
  @IsString()
  @IsNotEmpty({ message: 'Informe a categoria.' })
  @MaxLength(100)
  categoria: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'A data deve estar no formato AAAA-MM-DD.',
  })
  @IsISO8601({ strict: true }, { message: 'Data inválida.' })
  prazoISO: string;

  @IsIn(PRIORIDADES, { message: 'Prioridade inválida.' })
  prioridade: PrioridadeTarefa;
}