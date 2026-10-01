import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConvidadosController } from './convidados.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ConvidadosController],
})
export class ConvidadosModule {}