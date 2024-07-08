import { PartialType } from '@nestjs/mapped-types';
import { CreateAssistanceExamDto } from './create-assistance-exam.dto';

export class UpdateAssistanceExamDto extends PartialType(CreateAssistanceExamDto) {}
