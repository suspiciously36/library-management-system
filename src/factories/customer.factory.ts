import { define } from 'typeorm-seeding';
import { Customer } from '../entities/customer.entity';
import { customerData } from './data/customer.data';

define(Customer, (_, context: { index: number }) => {
  const customer = new Customer();

  (customer.name = customerData[context.index].name),
    (customer.email = customerData[context.index].email),
    (customer.address = customerData[context.index].address),
    (customer.phone = customerData[context.index].phone);
  return customer;
});
