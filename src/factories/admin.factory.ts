import { Admin } from '../api/v1/admins/entities/admin.entity';
import { define } from 'typeorm-seeding';
import * as bcrypt from 'bcrypt';

define(Admin, () => {
  const admin = new Admin();
  (admin.email = 'admintest2@gmail.com'),
    (admin.username = 'admin2'),
    (admin.password = bcrypt.hashSync('admin', 10));
  return admin;
});
