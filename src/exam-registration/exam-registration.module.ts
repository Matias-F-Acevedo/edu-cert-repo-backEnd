import { Module } from '@nestjs/common';
import { ExamRegistrationService } from './exam-registration.service';
import { ExamRegistrationController } from './exam-registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamRegistration } from './entities/exam-registration.entity';
import { Student } from 'src/students/entities/student.entity';
import { Exam } from 'src/exam/entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamRegistration,Student,Exam])],
  controllers: [ExamRegistrationController],
  providers: [ExamRegistrationService],
})
export class ExamRegistrationModule {}