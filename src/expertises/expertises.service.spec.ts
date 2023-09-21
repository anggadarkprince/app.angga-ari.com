import { Test, TestingModule } from '@nestjs/testing';
import { ExpertisesService } from './expertises.service';

describe('ExpertisesService', () => {
  let service: ExpertisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpertisesService],
    }).compile();

    service = module.get<ExpertisesService>(ExpertisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
