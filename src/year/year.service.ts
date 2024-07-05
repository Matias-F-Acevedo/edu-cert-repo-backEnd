import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateYearDto } from './dto/create-year.dto';
import { UpdateYearDto } from './dto/update-year.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Year } from './entities/year.entity';
import { Repository } from 'typeorm';
import { Career } from 'src/career/entities/career.entity';

@Injectable()
export class YearService {

  constructor(
    @InjectRepository(Year)
    private yearRepository: Repository<Year>,
    @InjectRepository(Career)
    private careerRepository: Repository<Career>) {}

    
  async create(createYearDto: CreateYearDto): Promise<HttpException | Year> {
    try {

      const yearFound = await this.yearRepository.findOne({ where: { number: createYearDto.number, career:{id:createYearDto.career} } });
      if (yearFound){
        return new HttpException('This year is already registered in the career', HttpStatus.CONFLICT);
      }

      const career = await this.careerRepository.findOne({
        where: { id: createYearDto.career},
      });

      if (!career) {
        return new HttpException('Career not found', HttpStatus.NOT_FOUND);
      }

      if(createYearDto.number > career.durationYears){
        return new HttpException('The number of years cannot be greater than the length of the career.', HttpStatus.CONFLICT);
      }

      const newOrder = this.yearRepository.create({...createYearDto, career:career});
      return this.yearRepository.save(newOrder);
    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findAll(): Promise<HttpException | Year[]> {
    try {
      const years = await this.yearRepository.find();
      return years;
    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async findOne(id: number): Promise<HttpException | Year> {
    try {
      const year = await this.yearRepository.findOne({
        where: {id: id},
      });

      if (!year) {
        return new HttpException('Year does not exist', HttpStatus.NOT_FOUND);
      }
      return year;
    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  // update(id: number, updateYearDto: UpdateYearDto) {
  //   return `This action updates a #${id} year`;
  // }



  async remove(id: number): Promise<HttpException | Year> {

    try {
      const year = await this.yearRepository.findOne({
        where: {id: id },
      });

      if (!year) {
        return new HttpException('The year does not exist', HttpStatus.NOT_FOUND);
      }
      this.yearRepository.delete({id: id});
      return year;

    } catch (error) {
      return new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

}
