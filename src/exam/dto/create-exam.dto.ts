import { Expose } from "class-transformer";
import { IsDateString, IsNumber, IsPositive } from "class-validator";




export class CreateExamDto {
    @IsDateString()
    date: Date;
  
    @Expose()
    @IsNumber()
    @IsPositive()
    subject: number;
  
    @Expose()
    @IsNumber()
    @IsPositive()
    professor: number;
}

