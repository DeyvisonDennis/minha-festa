import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { EventosModule } from '../eventos/eventos.module';
import { ConvidadosController } from './convidados.controller';
import { ConvidadosService } from './convidados.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), EventosModule],
  controllers: [ConvidadosController],
  providers: [ConvidadosService],
})
export class ConvidadosModule {}