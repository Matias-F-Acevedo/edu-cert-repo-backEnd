import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Career } from 'src/career/entities/career.entity';

@Entity()
export class University {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Career , career  => career.university)
  career: Career [];

}
