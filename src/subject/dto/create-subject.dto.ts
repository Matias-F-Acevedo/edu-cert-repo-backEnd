import { Expose } from 'class-transformer';
import {IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength} from 'class-validator';

export class CreateSubjectDto {
    @Expose()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @Expose()
    @IsNumber()
    @IsPositive()
    career: number;

    @Expose()
    @IsNumber()
    @IsPositive()
    year: number;

    @Expose()
    @IsNumber()
    @IsPositive()
    professorId: number;

    
    @Expose()
    @IsOptional()
    @IsNumber()
    @IsPositive()
    optionalProfessorId?: number;
}
