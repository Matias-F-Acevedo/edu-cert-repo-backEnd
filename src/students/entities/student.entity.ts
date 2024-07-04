import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column('date')
  enrollmentDate: string;
}