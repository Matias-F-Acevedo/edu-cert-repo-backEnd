import { Module } from '@nestjs/common';
import { AssistanceExamService } from './assistance-exam.service';
import { AssistanceExamController } from './assistance-exam.controller';

@Module({
  controllers: [AssistanceExamController],
  providers: [AssistanceExamService],
})
export class AssistanceExamModule {}
