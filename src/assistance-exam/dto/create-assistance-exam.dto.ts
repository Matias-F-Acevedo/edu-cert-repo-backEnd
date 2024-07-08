import { IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssistanceExamDto {
  @IsInt()
  @Type(() => Number)
  studentId: number;

  @IsInt()
  @Type(() => Number)
  examId: number;

  @IsBoolean()
  present: boolean;

}