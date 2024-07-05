import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { University } from 'src/university/entities/university.entity';
import { Year } from 'src/year/entities/year.entity';
import { Student } from 'src/students/entities/student.entity';

@Entity()
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  durationYears: number;

  @ManyToOne(() => University, university => university.career)
  university: University;

  @OneToMany(() => Year, year => year.career)
  years: Year[];

  @OneToMany(() => Student, student => student.career)
  students: Student[]; 
}
