import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessorService {

  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,) {}

  async create(createProfessorDto: CreateProfessorDto) {
    try {
      const professorFound = await this.professorRepository.findOne({
        where: { identificationNumber: createProfessorDto.identificationNumber },
      });
      if (professorFound) {
        return new HttpException(
          'This identificationNumber is registered',
          HttpStatus.CONFLICT,
        );
      }
      const professorFoundByEmail = await this.professorRepository.findOne({
        where: { email: createProfessorDto.email },
      });
      if (professorFoundByEmail) {
        return new HttpException(
          'This email is registered',
          HttpStatus.CONFLICT,
        );
      }
      const newProfessor = this.professorRepository.create({ ...createProfessorDto});
      const newProfessorSave = await this.professorRepository.save(newProfessor);
      return newProfessorSave;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const professor = await this.professorRepository.find();
      return professor;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async findOne(id: number) {
    try {
      const professor = await this.professorRepository.findOne({
        where: { id: id },
      });
      if (!professor) {
        return new HttpException(
          'Professor does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return professor;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  // update(id: number, updateProfessorDto: UpdateProfessorDto) {
  //   return `This action updates a #${id} professor`;
  // }

  async remove(id: number) {
    try {
      const professor = await this.professorRepository.findOne({
        where: { id: id },
      });

      if (!professor) {
        return new HttpException(
          'Professor does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.professorRepository.delete({ id: id });
      return professor;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
