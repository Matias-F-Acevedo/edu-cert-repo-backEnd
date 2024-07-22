import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExamRegistrationService } from './exam-registration.service';
import { CreateExamRegistrationDto } from './dto/create-exam-registration.dto';
import { UpdateExamRegistrationDto } from './dto/update-exam-registration.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('exam-registration')
export class ExamRegistrationController {
  constructor(private readonly examRegistrationService: ExamRegistrationService) {}

  @Post()
  create(@Body() createExamRegistrationDto: CreateExamRegistrationDto) {
    return this.examRegistrationService.create(createExamRegistrationDto);
  }

  @Get()
  findAll() {
    return this.examRegistrationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examRegistrationService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateExamRegistrationDto: UpdateExamRegistrationDto) {
  //   return this.examRegistrationService.update(+id, updateExamRegistrationDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examRegistrationService.remove(+id);
  }
}
