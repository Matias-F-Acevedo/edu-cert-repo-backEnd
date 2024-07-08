import { Expose } from "class-transformer";
import { IsDateString, IsNumber, IsPositive } from "class-validator";


export class CreateCorrelativeDto {
    @Expose()
    @IsNumber()
    @IsPositive()
    subject: number;

    @Expose()
    @IsNumber()
    @IsPositive()
    correlatives: number;
}
