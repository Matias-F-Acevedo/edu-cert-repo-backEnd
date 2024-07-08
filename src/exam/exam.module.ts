import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { Exam } from './entities/exam.entity';
import { Professor } from 'src/professor/entities/professor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam,Professor,Subject])],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
