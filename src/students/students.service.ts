import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const studentFound = await this.studentRepository.findOne({
        where: { identificationNumber: createStudentDto.identificationNumber },
      });

      if (studentFound)
        throw new Error('This identificationNumber is registered');
      const newStudent = this.studentRepository.create({ ...createStudentDto });

      const newStudentSave = await this.studentRepository.save(newStudent);

      return newStudentSave;
    } catch (error) {
      return new HttpException('Student already exists', HttpStatus.CONFLICT);
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
