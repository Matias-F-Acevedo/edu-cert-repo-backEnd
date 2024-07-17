import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Year } from 'src/year/entities/year.entity';
import { Exam } from 'src/exam/entities/exam.entity';
import { Correlative } from 'src/correlative/entities/correlative.entity';
import { Career } from 'src/career/entities/career.entity';
import { Professor } from 'src/professor/entities/professor.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Career, career => career.subjects) // Relación ManyToOne con Career
  career: Career;

  @ManyToOne(() => Year, year => year.subject)
  year: Year;
  
  @OneToMany(() => Correlative, correlative => correlative.subject)
  correlatives: Correlative[];

  @OneToMany(() => Exam, exam => exam.subject)
  exams: Exam[];

  @ManyToOne(() => Professor, professor => professor.subjects)
  professor: Professor;
  
  @ManyToOne(() => Professor, { nullable: true })
  optionalThirdProfessor: Professor;
  
  @ManyToOne(() => Professor, { nullable: true })
  optionalSecondProfessor: Professor;
}
