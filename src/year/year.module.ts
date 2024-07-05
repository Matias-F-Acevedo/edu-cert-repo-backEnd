import { Module } from '@nestjs/common';
import { YearService } from './year.service';
import { YearController } from './year.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Year } from './entities/year.entity';
import { Career } from 'src/career/entities/career.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Year,Career])],
  controllers: [YearController],
  providers: [YearService],
})
export class YearModule {}
