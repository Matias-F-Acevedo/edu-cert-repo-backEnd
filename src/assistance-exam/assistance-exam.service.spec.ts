import { Test, TestingModule } from '@nestjs/testing';
import { AssistanceExamService } from './assistance-exam.service';

describe('AssistanceExamService', () => {
  let service: AssistanceExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssistanceExamService],
    }).compile();

    service = module.get<AssistanceExamService>(AssistanceExamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
