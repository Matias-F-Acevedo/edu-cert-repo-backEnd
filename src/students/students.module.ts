import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from 'src/career/entities/career.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student,Career])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
