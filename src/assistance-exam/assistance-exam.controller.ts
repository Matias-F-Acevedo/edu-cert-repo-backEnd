import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AssistanceExamService } from './assistance-exam.service';
import { CreateAssistanceExamDto } from './dto/create-assistance-exam.dto';
import { UpdateAssistanceExamDto } from './dto/update-assistance-exam.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('assistance-exam')
export class AssistanceExamController {
  constructor(private readonly assistanceExamService: AssistanceExamService) {}

  @Post()
  create(@Body() createAssistanceExamDto: CreateAssistanceExamDto) {
    return this.assistanceExamService.create(createAssistanceExamDto);
  }

  @Get()
  findAll() {
    return this.assistanceExamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assistanceExamService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAssistanceExamDto: UpdateAssistanceExamDto) {
  //   return this.assistanceExamService.update(+id, updateAssistanceExamDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistanceExamService.remove(+id);
  }
}
