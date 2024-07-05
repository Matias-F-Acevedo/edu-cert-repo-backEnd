import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UniversityService {

  constructor(
    @InjectRepository(University)
    private universityRepository: Repository<University>) {}


  async create(createUniversityDto: CreateUniversityDto): Promise<HttpException | University> {
    try {
      const newUniversity = this.universityRepository.create(createUniversityDto);
      return this.universityRepository.save(newUniversity);
    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<HttpException | University[]> {
    try {
      const universities = await this.universityRepository.find();
      return universities;
    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findOne(id: number): Promise<HttpException | University> {
    try {
      const university = await this.universityRepository.findOne({
        where: { id: id },
      });
      if (!university) {
        return new HttpException('University does not exist', HttpStatus.NOT_FOUND);
      }
      return university;

    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  // update(id: number, updateUniversityDto: UpdateUniversityDto) {
  //   return `This action updates a #${id} university`;
  // }


  async remove(id: number): Promise<HttpException | University> {

    try {
      const university = await this.universityRepository.findOne({
        where: { id: id },
      });
      if (!university) {
        return new HttpException('The university does not exist', HttpStatus.NOT_FOUND);
      }
      this.universityRepository.delete({id: id });
      return university;

    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
