import { IsEnum } from 'class-validator';
import { status_tarefa } from '../../generated/prisma/enums';

export class AlterarStatusDto {
  @IsEnum(status_tarefa, { message: 'Status inválido.' })
  status: status_tarefa;
}