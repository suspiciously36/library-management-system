import { Admin } from '../../src/api/v1/admins/entities/admin.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateAdmin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Admin)().create();
  }
}
