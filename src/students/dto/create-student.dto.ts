import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';


export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}


export class CreateStudentDto {
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
  @IsDateString()
  dateOfBirth: Date;

  @Expose()
  @IsString()
  @MinLength(7)
  @MaxLength(15)
  phoneNumber: string;

  @Expose()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  yearOfAdmission: string;

  @Expose()
  @IsString()
  @MinLength(7)
  @MaxLength(9)
  identificationNumber: string;

  @Expose()
  @IsString()
  @MinLength(7)
  @MaxLength(254)
  email: string;

  @Expose()
  @IsNumber()
  @IsPositive()
  career: number;

  @IsEnum(Gender)
  gender?: Gender;

  @Expose()
  @IsOptional()
  @IsString()
  birthplace?: string;

  @Expose()
  @IsOptional()
  @IsString()
  nationality?: string;

  @Expose()
  @IsOptional()
  @IsString()
  documentType?:string;

  @Expose()
  @IsOptional()
  @IsString()
  countryDocument?:string;

  @Expose()
  @IsOptional()
  @IsString()
  cuil?:string;

  @Expose()
  @IsOptional()
  @IsDateString()
  registrationDate?:Date;

  @Expose()
  @IsOptional()
  @IsString()
  cohorte?:string;

  @Expose()
  @IsOptional()
  @IsString()
  affiliate?:string;

  @Expose()
  @IsOptional()
  @IsString()
  affiliateNumber?:string;
}
