import { Test, TestingModule } from '@nestjs/testing';
import { ExpertisesController } from './expertises.controller';
import { ExpertisesService } from './expertises.service';

describe('ExpertisesController', () => {
  let controller: ExpertisesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpertisesController],
      providers: [ExpertisesService],
    }).compile();

    controller = module.get<ExpertisesController>(ExpertisesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
