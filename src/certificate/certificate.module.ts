import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { AssistanceExam } from 'src/assistance-exam/entities/assistance-exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student,AssistanceExam])],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
