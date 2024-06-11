import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../../src/controllers/customer.controller';
import { CustomerService } from '../../src/services/customer.service';

describe('CustomerController', () => {
  let controller: CustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [CustomerService],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
