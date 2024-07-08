import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssistanceExamDto } from './dto/create-assistance-exam.dto';
import { UpdateAssistanceExamDto } from './dto/update-assistance-exam.dto';
import { AssistanceExam } from './entities/assistance-exam.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from 'src/exam/entities/exam.entity';
import { Student } from 'src/students/entities/student.entity';

@Injectable()
export class AssistanceExamService {
  constructor(
    @InjectRepository(AssistanceExam)
    private assistanceExamRepository: Repository<AssistanceExam>,
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Student)
    private studentExamRepository: Repository<Student>,) {}
  

  async create(createAssistanceExamDto: CreateAssistanceExamDto) {

    try {
      const studentFound = await this.studentExamRepository.findOne({
        where: {id: createAssistanceExamDto.studentId},
      });

      if (!studentFound) {
        return new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      const examFound = await this.examRepository.findOne({
        where: {id: createAssistanceExamDto.examId},
      });

      if (!examFound) {
        return new HttpException('Exam not found', HttpStatus.NOT_FOUND);
      }

      const assistanceExam = await this.assistanceExamRepository.findOne({
        where: {exam: {id:createAssistanceExamDto.examId}, student: {id:createAssistanceExamDto.studentId}},
      });

      if (assistanceExam) {
        return new HttpException(
          'there is already a registration of the student in the exam.',
          HttpStatus.CONFLICT,
        );
      }
      const newAssistanceExam = this.assistanceExamRepository.create({ ...createAssistanceExamDto, student:studentFound, exam:examFound});
      const newAssistanceExamSave = await this.assistanceExamRepository.save(newAssistanceExam);
      return newAssistanceExamSave;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async findAll() {
    try {
      const assistanceExam = await this.assistanceExamRepository.find({relations:["student", "exam"]});
      return assistanceExam;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }





  async findOne(id: number) {
    try {
      const assistanceExam = await this.assistanceExamRepository.findOne({
        where: { id: id }, relations:["student", "exam"]
      });
      if (!assistanceExam) {
        return new HttpException(
          'Examination assistance does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return assistanceExam;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  // update(id: number, updateAssistanceExamDto: UpdateAssistanceExamDto) {
  //   return `This action updates a #${id} assistanceExam`;
  // }

  async remove(id: number) {
    try {
      const assistanceExam = await this.assistanceExamRepository.findOne({
        where: { id: id },
      });

      if (!assistanceExam) {
        return new HttpException(
          'Examination assistance does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.assistanceExamRepository.delete({ id: id });
      return assistanceExam;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


}
