import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { status_tarefa } from '../../generated/prisma/enums';

export class ItemOrdemDto {
  @IsUUID()
  id: string;

  @IsEnum(status_tarefa, { message: 'Status inválido.' })
  status: status_tarefa;
}

export class ReordenarTarefasDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => ItemOrdemDto)
  itens: ItemOrdemDto[];
}