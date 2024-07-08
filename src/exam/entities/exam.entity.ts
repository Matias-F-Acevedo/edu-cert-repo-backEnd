import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { Professor } from 'src/professor/entities/professor.entity';
import { AssistanceExam } from 'src/assistance-exam/entities/assistance-exam.entity';
import { ExamRegistration } from 'src/exam-registration/entities/exam-registration.entity';


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

  @OneToMany(() => AssistanceExam, assistanceExam => assistanceExam.exam)
  assistanceExams: AssistanceExam[];

  @OneToMany(() => ExamRegistration, examRegistration => examRegistration.exam)
  examRegistrations: ExamRegistration[];
}
