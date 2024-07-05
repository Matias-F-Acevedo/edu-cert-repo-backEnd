import { Module } from '@nestjs/common';
import { CorrelativeService } from './correlative.service';
import { CorrelativeController } from './correlative.controller';

@Module({
  controllers: [CorrelativeController],
  providers: [CorrelativeService],
})
export class CorrelativeModule {}
