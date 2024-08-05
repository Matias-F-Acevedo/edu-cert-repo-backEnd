import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Career } from 'src/career/entities/career.entity';
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
  
  @Column({ nullable: true })
  address: string;

  @Column()
  email: string;

  @Column()
  dateOfBirth: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  yearOfAdmission: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthplace: String;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  documentType:string;

  @Column({ nullable: true })
  countryDocument:string;

  @Column({ nullable: true })
  cuil:string;

  @Column({ nullable: true })
  registrationDate:Date;

  @Column({ nullable: true })
  cohorte:string;

  @Column({ nullable: true })
  affiliate:string;

  @Column({ nullable: true })
  affiliateNumber:string;

  @Column({ nullable: true })
  title:string;

  @Column({ nullable: true })
  city:string;

  @ManyToMany(() => Career, career => career.students)
  @JoinTable()
  careers: Career[];


  // // original:
  // @ManyToOne(() => Career, career => career.studentss)
  // career: Career;

  @OneToMany(() => AssistanceExam, AssistanceExam => AssistanceExam.student)
  AssistanceExams: AssistanceExam[];

  @OneToMany(() => ExamRegistration, examRegistration => examRegistration.student)
  examRegistrations: ExamRegistration[];
}   
