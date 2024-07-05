import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Repository } from 'typeorm';
import { Year } from 'src/year/entities/year.entity';
import { Career } from 'src/career/entities/career.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Year)
    private yearRepository: Repository<Year>,
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
  ) {}

  async create(
    createSubjectDto: CreateSubjectDto,
  ): Promise<HttpException | Subject> {
    try {
      const yearFound = await this.yearRepository.findOne({
        where: { id: createSubjectDto.year },
      });
      if (!yearFound) {
        return new HttpException('Year not found', HttpStatus.NOT_FOUND);
      }

      const careerFound = await this.careerRepository.findOne({
        where: { id: createSubjectDto.career },
      });
      if (!careerFound) {
        return new HttpException('Career not found', HttpStatus.NOT_FOUND);
      }

      const subjectFound = await this.subjectRepository.findOne({
        where: {
          name: createSubjectDto.name,
          career: { id: createSubjectDto.career },
          year: { id: createSubjectDto.year },
        },
      });
      if (subjectFound) {
        return new HttpException(
          'This subject is already registered in the same career and year.',
          HttpStatus.CONFLICT,
        );
      }

      const newSubject = this.subjectRepository.create({
        ...createSubjectDto,
        year: yearFound,
        career: careerFound,
      });
      return this.subjectRepository.save(newSubject);
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<HttpException | Subject[]> {
    try {
      const subject = await this.subjectRepository.find({
        relations: ['year', 'career'],
      });
      return subject;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<HttpException | Subject> {
    try {
      const subject = await this.subjectRepository.findOne({
        where: { id: id },
        relations: ['year', 'career'],
      });

      if (!subject) {
        return new HttpException(
          'Subject does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return subject;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update(id: number, updateSubjectDto: UpdateSubjectDto) {
  //   return `This action updates a #${id} subject`;
  // }

  async remove(id: number): Promise<HttpException | Subject> {
    try {
      const subject = await this.subjectRepository.findOne({
        where: { id: id },
      });

      if (!subject) {
        return new HttpException(
          'The subject does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      this.subjectRepository.delete({ id: id });
      return subject;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
