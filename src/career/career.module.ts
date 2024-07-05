import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from './entities/career.entity';
import { University } from 'src/university/entities/university.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Career,University])],
  controllers: [CareerController],
  providers: [CareerService],
})
export class CareerModule {}
