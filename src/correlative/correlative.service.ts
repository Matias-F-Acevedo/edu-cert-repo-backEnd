import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCorrelativeDto } from './dto/create-correlative.dto';
import { UpdateCorrelativeDto } from './dto/update-correlative.dto';
import { Correlative } from './entities/correlative.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';

@Injectable()
export class CorrelativeService {

  constructor(
    @InjectRepository(Correlative)
    private correlativeRepository: Repository<Correlative>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,) {}

  async create(createCorrelativeDto: CreateCorrelativeDto) {
    try {

      const subjectFound = await this.subjectRepository.findOne({
        where: {id: createCorrelativeDto.subject},
      });

      if (!subjectFound) {
        return new HttpException('Subject not found', HttpStatus.NOT_FOUND);
      }

      const subjectCorrelativeFound = await this.subjectRepository.findOne({
        where: {id: createCorrelativeDto.correlatives},
      });

      if (!subjectCorrelativeFound) {
        return new HttpException('Subject correlative not found', HttpStatus.NOT_FOUND);
      }


      const correlative = await this.correlativeRepository.findOne({
        where: {subject: {id:createCorrelativeDto.subject}, correlatives: {id:createCorrelativeDto.correlatives}},
      });

      if (correlative) {
        return new HttpException(
          'There is a correlative subject registered to the same subject.',
          HttpStatus.CONFLICT,
        );
      }

  
  
      const newCorrelative = this.correlativeRepository.create({ ...createCorrelativeDto, subject:subjectFound, correlatives:subjectCorrelativeFound});
      const newCorrelativeSave = await this.correlativeRepository.save(newCorrelative);
      return newCorrelativeSave;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const correlative = await this.correlativeRepository.find({relations:["subject", "correlatives"]});
      return correlative;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



 async findOne(id: number) {
    try {
      const correlative = await this.correlativeRepository.findOne({
        where: { id: id }, relations:["subject", "correlatives"]
      });
      if (!correlative) {
        return new HttpException(
          'Subject correlative does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return correlative;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update(id: number, updateCorrelativeDto: UpdateCorrelativeDto) {
  //   return `This action updates a #${id} correlative`;
  // }

  async remove(id: number) {
    try {
      const correlative = await this.correlativeRepository.findOne({
        where: { id: id },
      });

      if (!correlative) {
        return new HttpException(
          'Subject correlative does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.correlativeRepository.delete({ id: id });
      return correlative;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
