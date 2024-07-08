import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { Repository } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { Professor } from 'src/professor/entities/professor.entity';

@Injectable()
export class ExamService {

  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,) {}

  async create(createExamDto: CreateExamDto) {
    try {

      const subjectFound = await this.subjectRepository.findOne({
        where: {id: createExamDto.subject},
      });

      if (!subjectFound) {
        return new HttpException('Subject not found', HttpStatus.NOT_FOUND);
      }

      const professorFound = await this.professorRepository.findOne({
        where: {id: createExamDto.professor},
      });

      if (!professorFound) {
        return new HttpException('Professor not found', HttpStatus.NOT_FOUND);
      }


      const examFound = await this.examRepository.findOne({
        where: {date: createExamDto.date, subject: {id:createExamDto.subject}},
      });

      if (examFound) {
        return new HttpException(
          'There is an exam registered on the same day with the same subject.',
          HttpStatus.CONFLICT,
        );
      }

  
  
      const newExam = this.examRepository.create({ ...createExamDto, subject:subjectFound, professor:professorFound});
      const newExamSave = await this.examRepository.save(newExam);
      return newExamSave;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
 

  async findAll() {
    try {
      const exam = await this.examRepository.find({relations:["subject","professor"]});
      return exam;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const exam = await this.examRepository.findOne({
        where: { id: id }, relations:["subject","professor"]
      });
      if (!exam) {
        return new HttpException(
          'Exam does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return exam;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update(id: number, updateExamDto: UpdateExamDto) {
  //   return `This action updates a #${id} exam`;
  // }

  async remove(id: number) {
    try {
      const exam = await this.examRepository.findOne({
        where: { id: id },
      });

      if (!exam) {
        return new HttpException(
          'Exam does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.examRepository.delete({ id: id });
      return exam;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
