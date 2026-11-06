import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { aparar } from '../../common/aparar';

export class EnviarConvitesDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Selecione pelo menos um destinatário.' })
  @ArrayMaxSize(500)
  @IsUUID('all', { each: true })
  convidadoIds: string[];

  @Transform(aparar)
  @IsString()
  @IsNotEmpty({ message: 'Informe o assunto.' })
  @MaxLength(200)
  assunto: string;

  @IsString()
  @IsNotEmpty({ message: 'Escreva a mensagem.' })
  @MaxLength(5000)
  mensagem: string;
}