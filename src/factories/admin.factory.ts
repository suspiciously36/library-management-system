import { Admin } from '../entities/admin.entity';
import { define } from 'typeorm-seeding';
import * as bcrypt from 'bcrypt';

define(Admin, () => {
  const admin = new Admin();
  (admin.email = 'admin.seeder@gmail.com'),
    (admin.username = 'admin'),
    (admin.password = bcrypt.hashSync('admin', 10));
  return admin;
});
