import { Injectable } from '@nestjs/common';
import { CreateCorrelativeDto } from './dto/create-correlative.dto';
import { UpdateCorrelativeDto } from './dto/update-correlative.dto';

@Injectable()
export class CorrelativeService {
  create(createCorrelativeDto: CreateCorrelativeDto) {
    return 'This action adds a new correlative';
  }

  findAll() {
    return `This action returns all correlative`;
  }

  findOne(id: number) {
    return `This action returns a #${id} correlative`;
  }

  update(id: number, updateCorrelativeDto: UpdateCorrelativeDto) {
    return `This action updates a #${id} correlative`;
  }

  remove(id: number) {
    return `This action removes a #${id} correlative`;
  }
}
