import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from '../../src/controllers/reservations.controller';
import { ReservationsService } from '../../src/services/reservations.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [ReservationsService],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
