import { Injectable } from '@nestjs/common';
import { CreateAssistanceExamDto } from './dto/create-assistance-exam.dto';
import { UpdateAssistanceExamDto } from './dto/update-assistance-exam.dto';

@Injectable()
export class AssistanceExamService {
  create(createAssistanceExamDto: CreateAssistanceExamDto) {
    return 'This action adds a new assistanceExam';
  }

  findAll() {
    return `This action returns all assistanceExam`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assistanceExam`;
  }

  update(id: number, updateAssistanceExamDto: UpdateAssistanceExamDto) {
    return `This action updates a #${id} assistanceExam`;
  }

  remove(id: number) {
    return `This action removes a #${id} assistanceExam`;
  }
}
