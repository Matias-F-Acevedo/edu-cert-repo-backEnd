import { Expose } from 'class-transformer';
import {IsNumber, IsPositive} from 'class-validator';


export class CreateYearDto {
    @Expose()
    @IsNumber()
    @IsPositive()
    number: number;

    @Expose()
    @IsNumber()
    @IsPositive()
    career: number;
}




