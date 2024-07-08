import { Test, TestingModule } from '@nestjs/testing';
import { AssistanceExamController } from './assistance-exam.controller';
import { AssistanceExamService } from './assistance-exam.service';

describe('AssistanceExamController', () => {
  let controller: AssistanceExamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssistanceExamController],
      providers: [AssistanceExamService],
    }).compile();

    controller = module.get<AssistanceExamController>(AssistanceExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
