import { Expose } from 'class-transformer';
import { IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProfessorDto {
    @Expose()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    firstName: string;

    @Expose()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    lastName: string;

    @Expose()
    @IsString()
    @MinLength(7)
    @MaxLength(254)
    email: string;

    @Expose()
    @IsString()
    @MinLength(7)
    @MaxLength(9)
    identificationNumber: string;
}

