import { Factory, Seeder } from 'typeorm-seeding';
import { Customer } from '../entities/customer.entity';
import { customerData } from '../factories/data/customer.data';

export default class CreateCustomer implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (let i = 0; i < customerData.length; i++) {
      await factory(Customer)({ index: i }).create();
    }
  }
}
