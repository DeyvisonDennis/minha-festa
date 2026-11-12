import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ContaController } from './conta.controller';
import { ContaService } from './conta.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ContaController],
  providers: [ContaService],
})
export class ContaModule {}