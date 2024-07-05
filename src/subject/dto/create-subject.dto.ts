import { Expose } from 'class-transformer';
import {IsNumber, IsPositive, IsString, MaxLength, MinLength} from 'class-validator';

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
}
