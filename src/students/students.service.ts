import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Career } from 'src/career/entities/career.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {

      const careerFound = await this.careerRepository.findOne({
        where: { id: createStudentDto.career},
      });
      if (!careerFound){
        return new HttpException(
          'Career does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      const studentFound = await this.studentRepository.findOne({
        where: { identificationNumber: createStudentDto.identificationNumber },
      });
      if (studentFound) {
        return new HttpException(
          'This identificationNumber is registered',
          HttpStatus.CONFLICT,
        );
      }


      const studentFoundByEmail = await this.studentRepository.findOne({
        where: { email: createStudentDto.email },
      });
      if (studentFoundByEmail) {
        return new HttpException(
          'This email is registered',
          HttpStatus.CONFLICT,
        );
      }

      const newStudent = this.studentRepository.create({ ...createStudentDto, career:careerFound });
      const newStudentSave = await this.studentRepository.save(newStudent);
      return newStudentSave;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const students = await this.studentRepository.find();
      return students;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: id },
      });
      if (!student) {
        return new HttpException(
          'Student does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return student;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update(id: number, updateStudentDto: UpdateStudentDto) {
  //   return `This action updates a #${id} student`;
  // }

  async remove(id: number) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: id },
      });

      if (!student) {
        return new HttpException(
          'Student does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.studentRepository.delete({ id: id });
      return student;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
