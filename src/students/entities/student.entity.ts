import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Career } from 'src/career/entities/career.entity';
import { Exam } from 'src/exam/entities/exam.entity';
import { AssistanceExam } from 'src/assistance-exam/entities/assistance-exam.entity';
import { ExamRegistration } from 'src/exam-registration/entities/exam-registration.entity';


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

  @OneToMany(() => AssistanceExam, AssistanceExam => AssistanceExam.student)
  AssistanceExams: AssistanceExam[];

  @OneToMany(() => ExamRegistration, examRegistration => examRegistration.student)
  examRegistrations: ExamRegistration[];

  // @ManyToMany(() => Exam)
  // @JoinTable()
  // exams: Exam[];
}   
