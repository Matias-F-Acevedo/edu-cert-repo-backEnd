import { Expose } from 'class-transformer';
import {IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCareerDto {
    @Expose()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @Expose()
    @IsNumber()
    @IsPositive()
    durationYears:number

    @Expose()
    @IsNumber()
    @IsPositive()
    university:number
}

