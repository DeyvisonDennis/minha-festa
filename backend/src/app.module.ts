import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ConvidadosModule } from './convidados/convidados.module';
import { EventosModule } from './eventos/eventos.module';
import { TarefasModule } from './tarefas/tarefas.module';
import { RsvpModule } from './rsvp/rsvp.module';

@Module({
  imports: [PrismaModule, AuthModule, EmailModule, ConvidadosModule, EventosModule, TarefasModule, RsvpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}