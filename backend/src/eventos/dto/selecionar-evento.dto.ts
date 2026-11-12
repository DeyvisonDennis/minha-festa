import { IsUUID } from 'class-validator';

export class SelecionarEventoDto {
  @IsUUID('all', { message: 'Evento inválido.' })
  eventoId: string;
}