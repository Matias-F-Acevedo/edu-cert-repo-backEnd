import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateModule } from './certificate/certificate.module';
import { UniversityModule } from './university/university.module';
import { CareerModule } from './career/career.module';
import { YearModule } from './year/year.module';
import { SubjectModule } from './subject/subject.module';
import { CorrelativeModule } from './correlative/correlative.module';
import { ProfessorModule } from './professor/professor.module';
import { ExamModule } from './exam/exam.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'cert_students',
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    StudentsModule,
    CertificateModule,
    UniversityModule,
    CareerModule,
    YearModule,
    SubjectModule,
    CorrelativeModule,
    ProfessorModule,
    ExamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
