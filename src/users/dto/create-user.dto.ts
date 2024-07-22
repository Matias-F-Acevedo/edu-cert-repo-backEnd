import { Expose } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  firstName: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  lastName: string;
}
