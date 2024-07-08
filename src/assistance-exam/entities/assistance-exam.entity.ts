import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Exam } from 'src/exam/entities/exam.entity';

@Entity()
export class AssistanceExam {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, student => student.AssistanceExams)
  student: Student;

  @ManyToOne(() => Exam, exam => exam.assistanceExams)
  exam: Exam;

  @Column({ default: false })
  present: boolean;
  
}