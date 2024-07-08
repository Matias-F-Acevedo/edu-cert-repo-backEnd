import { Test, TestingModule } from '@nestjs/testing';
import { ExamRegistrationService } from './exam-registration.service';

describe('ExamRegistrationService', () => {
  let service: ExamRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamRegistrationService],
    }).compile();

    service = module.get<ExamRegistrationService>(ExamRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
