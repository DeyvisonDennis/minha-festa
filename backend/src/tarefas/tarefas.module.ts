import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { EventosModule } from '../eventos/eventos.module';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), EventosModule],
  controllers: [TarefasController],
  providers: [TarefasService],
})
export class TarefasModule {}