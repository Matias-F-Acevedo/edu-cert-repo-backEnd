import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Career } from 'src/career/entities/career.entity';
import { Exam } from 'src/exam/entities/exam.entity';


@Entity()
export class Student {
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

  @ManyToOne(() => Career, career => career.students)
  career: Career;

  @ManyToMany(() => Exam)
  @JoinTable()
  exams: Exam[];
}
