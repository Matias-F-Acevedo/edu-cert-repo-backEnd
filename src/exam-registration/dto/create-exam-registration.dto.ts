import { IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamRegistrationDto {
  @IsInt()
  @Type(() => Number)
  studentId: number;

  @IsInt()
  @Type(() => Number)
  examId: number;

  // @IsDateString()
  // registrationDate: Date;
}