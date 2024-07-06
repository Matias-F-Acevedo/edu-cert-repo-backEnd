import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exam } from 'src/exam/entities/exam.entity';

@Entity()
export class Professor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
  
  @Column({unique:true})
  identificationNumber: string;

  @Column()
  email: string;

  @OneToMany(() => Exam, exam => exam.professor)
  exams: Exam[]; 
}
