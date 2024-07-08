import { PartialType } from '@nestjs/mapped-types';
import { CreateExamRegistrationDto } from './create-exam-registration.dto';

export class UpdateExamRegistrationDto extends PartialType(CreateExamRegistrationDto) {}
