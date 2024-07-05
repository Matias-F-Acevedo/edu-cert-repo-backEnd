import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Year } from 'src/year/entities/year.entity';
import { Subject } from './entities/subject.entity';
import { Career } from 'src/career/entities/career.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject,Year,Career])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
