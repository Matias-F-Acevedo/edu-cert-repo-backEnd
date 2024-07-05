import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Career } from './entities/career.entity';
import { Repository } from 'typeorm';
import { University } from 'src/university/entities/university.entity';

@Injectable()
export class CareerService {

  constructor(
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,) { }

  async create(createCareerDto: CreateCareerDto): Promise<HttpException | Career> {
    try {
      const careerFound = await this.careerRepository.findOne({ where: { name: createCareerDto.name } });
      if (careerFound){
        return new HttpException('This name is registered', HttpStatus.CONFLICT);
      }

      const university = await this.universityRepository.findOne({
        where: { id: createCareerDto.university },
      });

      if (!university) {
        return new HttpException('University not found', HttpStatus.NOT_FOUND);
      }
      const newOrder = this.careerRepository.create({...createCareerDto, university:university});
      return this.careerRepository.save(newOrder);

    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }


  async findAll(): Promise<HttpException | Career[]> {
    try {
      const carrers = await this.careerRepository.find();
      return carrers;
    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findOne(id: number): Promise<HttpException | Career> {
    try {
      const career = await this.careerRepository.findOne({
        where: {id: id},
      });

      if (!career) {
        return new HttpException('Career does not exist', HttpStatus.NOT_FOUND);
      }
      return career;
    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  // update(id: number, updateCareerDto: UpdateCareerDto) {
  //   return `This action updates a #${id} career`;
  // }


  async remove(id: number): Promise<HttpException | Career> {

    try {
      const career = await this.careerRepository.findOne({
        where: {id: id },
      });

      if (!career) {
        return new HttpException('The career does not exist', HttpStatus.NOT_FOUND);
      }
      this.careerRepository.delete({id: id});
      return career;

    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
