import { Test, TestingModule } from '@nestjs/testing';
import { FineController } from '../../src/controllers/fine.controller';
import { FineService } from '../../src/services/fine.service';

describe('FineController', () => {
  let controller: FineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FineController],
      providers: [FineService],
    }).compile();

    controller = module.get<FineController>(FineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
