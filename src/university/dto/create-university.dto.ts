import { Expose } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUniversityDto {
    @Expose()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;
}


