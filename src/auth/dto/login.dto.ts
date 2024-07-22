import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}
