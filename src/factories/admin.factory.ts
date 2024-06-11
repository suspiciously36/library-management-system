import { Admin } from '../entities/admin.entity';
import { define } from 'typeorm-seeding';
import * as bcrypt from 'bcrypt';

define(Admin, () => {
  const admin = new Admin();
  (admin.email = 'admintest3@gmail.com'),
    (admin.username = 'admin3'),
    (admin.password = bcrypt.hashSync('admin3', 10));
  return admin;
});
