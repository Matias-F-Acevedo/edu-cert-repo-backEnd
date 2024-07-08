import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Exam } from 'src/exam/entities/exam.entity';

@Entity()
export class ExamRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.examRegistrations)
  student: Student;

  @ManyToOne(() => Exam, (exam) => exam.examRegistrations)
  exam: Exam;

  @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
  registrationDate: Date;
}
