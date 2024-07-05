import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Career } from 'src/career/entities/career.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Entity()
export class Year {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @ManyToOne(() => Career, career => career.years)
  career: Career;

  @OneToMany(() => Subject, subject => subject.year)
  subject: Subject[];

}
