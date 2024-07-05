import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { Professor } from 'src/professor/entities/professor.entity';


@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => Subject, subject => subject.exams)
  subject: Subject;

  @ManyToOne(() => Professor, professor => professor.exams)
  professor: Professor;
}
