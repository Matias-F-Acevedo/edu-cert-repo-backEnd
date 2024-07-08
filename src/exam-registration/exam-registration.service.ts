import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExamRegistrationDto } from './dto/create-exam-registration.dto';
import { UpdateExamRegistrationDto } from './dto/update-exam-registration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamRegistration } from './entities/exam-registration.entity';
import { Repository } from 'typeorm';
import { Exam } from 'src/exam/entities/exam.entity';
import { Student } from 'src/students/entities/student.entity';

@Injectable()
export class ExamRegistrationService {
  
  constructor(
    @InjectRepository(ExamRegistration)
    private registrationExamRepository: Repository<ExamRegistration>,
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  

  async create(createExamRegistrationDto: CreateExamRegistrationDto) {

    try {
      const studentFound = await this.studentRepository.findOne({
        where: {id: createExamRegistrationDto.studentId},
      });

      if (!studentFound) {
        return new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      const examFound = await this.examRepository.findOne({
        where: {id: createExamRegistrationDto.examId},
      });

      if (!examFound) {
        return new HttpException('Exam not found', HttpStatus.NOT_FOUND);
      }

      const registrationExam = await this.registrationExamRepository.findOne({
        where: {exam: {id:createExamRegistrationDto.examId}, student: {id:createExamRegistrationDto.studentId}},
      });

      if (registrationExam) {
        return new HttpException(
          'there is already a registration of the student in the exam.',
          HttpStatus.CONFLICT,
        );
      }
      const newregistrationExam = this.registrationExamRepository.create({ ...createExamRegistrationDto, student:studentFound, exam:examFound});
      const newregistrationExamSave = await this.registrationExamRepository.save(newregistrationExam);
      return newregistrationExamSave;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async findAll() {
    try {
      const registrationExam = await this.registrationExamRepository.find({relations:["student", "exam"]});
      return registrationExam;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



async findOne(id: number) {
    try {
      const registrationExam = await this.registrationExamRepository.findOne({
        where: { id: id }, relations:["student", "exam"]
      });
      if (!registrationExam) {
        return new HttpException(
          'Registration for examination does not exist.',
          HttpStatus.NOT_FOUND,
        );
      }
      return registrationExam;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update(id: number, updateExamRegistrationDto: UpdateExamRegistrationDto) {
  //   return `This action updates a #${id} examRegistration`;
  // }

  async remove(id: number) {
    try {
      const registrationExam = await this.registrationExamRepository.findOne({
        where: { id: id },
      });

      if (!registrationExam) {
        return new HttpException(
          'Registration for examination does not exist.',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.registrationExamRepository.delete({ id: id });
      return registrationExam;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
