import { Module } from '@nestjs/common';
import { CorrelativeService } from './correlative.service';
import { CorrelativeController } from './correlative.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Correlative } from './entities/correlative.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Correlative])],
  controllers: [CorrelativeController],
  providers: [CorrelativeService],
})

export class CorrelativeModule {}
