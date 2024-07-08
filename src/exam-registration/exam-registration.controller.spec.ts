import { Test, TestingModule } from '@nestjs/testing';
import { ExamRegistrationController } from './exam-registration.controller';
import { ExamRegistrationService } from './exam-registration.service';

describe('ExamRegistrationController', () => {
  let controller: ExamRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamRegistrationController],
      providers: [ExamRegistrationService],
    }).compile();

    controller = module.get<ExamRegistrationController>(ExamRegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
