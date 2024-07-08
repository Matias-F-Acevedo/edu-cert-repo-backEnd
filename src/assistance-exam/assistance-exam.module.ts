import { Module } from '@nestjs/common';
import { AssistanceExamService } from './assistance-exam.service';
import { AssistanceExamController } from './assistance-exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Exam } from 'src/exam/entities/exam.entity';
import { AssistanceExam } from './entities/assistance-exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssistanceExam,Student,Exam])],
  controllers: [AssistanceExamController],
  providers: [AssistanceExamService],
})
export class AssistanceExamModule {}
