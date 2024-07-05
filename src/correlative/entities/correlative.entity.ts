import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';

@Entity()
export class Correlative {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subject, subject => subject.correlatives)
  subject: Subject;

  @ManyToOne(() => Subject)
  correlatives: Subject;
}
