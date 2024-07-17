import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Repository } from 'typeorm';
import { Year } from 'src/year/entities/year.entity';
import { Career } from 'src/career/entities/career.entity';
import { Professor } from 'src/professor/entities/professor.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Year)
    private yearRepository: Repository<Year>,
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
  ) {}

  async create(
    createSubjectDto: CreateSubjectDto,
  ): Promise<HttpException | Subject> {
    try {
      const professorFound = await this.professorRepository.findOne({
        where: { id: createSubjectDto.professorId },
      });

      if (!professorFound) {
        return new HttpException('Professor not found', HttpStatus.NOT_FOUND);
      }

      if (
        createSubjectDto.professorId ==
          createSubjectDto.optionalSecondProfessorId ||
        createSubjectDto.professorId ==
          createSubjectDto.optionalThirdProfessorId ||
        createSubjectDto.optionalSecondProfessorId ==
          createSubjectDto.optionalThirdProfessorId
      ) {
        return new HttpException(
          'The optional teacher cannot be the same as the main teacher.',
          HttpStatus.CONFLICT,
        );
      }

      let optionalProfessorFound: Professor = null;
      if (createSubjectDto.optionalSecondProfessorId) {
        optionalProfessorFound = await this.professorRepository.findOne({
          where: { id: createSubjectDto.optionalSecondProfessorId },
        });

        if (!optionalProfessorFound) {
          return new HttpException(
            'Optional Second professor not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      let optionalThirdProfessor: Professor = null;
      if (createSubjectDto.optionalThirdProfessorId) {
        optionalThirdProfessor = await this.professorRepository.findOne({
          where: { id: createSubjectDto.optionalThirdProfessorId },
        });

        if (!optionalThirdProfessor) {
          return new HttpException(
            'Optional Third professor not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }

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
        professor: professorFound,
        optionalSecondProfessor: optionalProfessorFound,
        optionalThirdProfessor:optionalThirdProfessor
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
        relations: ['year', 'career', 'professor'],
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
        relations: ['year', 'career', 'professor'],
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
